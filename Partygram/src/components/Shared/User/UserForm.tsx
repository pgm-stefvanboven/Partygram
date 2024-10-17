import React, { useState } from "react";
import { Button, Image, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import AppTextField from "../Formik/AppTextField";
import ErrorMessage from "../../Design/Text/ErrorMessage";
import AppForm from "../Formik/AppForm";
import AppSubmitButton from "../Formik/AppSubmitButton";
import {
  CreateUserBody,
  UpdateUserBody,
} from "../../../core/modules/auth/types";
import AppSwitch from "../Formik/AppSwitch";

const getSchema = (options: Options) => {
  return yup.object().shape({
    email: yup
      .string()
      .email()
      .required()
      .matches(
        /(@arteveldehs.be|@student.arteveldehs.be)/,
        "Domain not allowed only @arteveldehs.be or @student.arteveldehs.be"
      ),
    ...(options.showPassword
      ? { password: yup.string().min(8).required() }
      : {}),
    username: yup.string().required(),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    condition: yup.boolean().required(),
  });
};

type Options = {
  showPassword: boolean;
};

const defaultOptions = {
  showPassword: true,
};

type Props<T> = {
  initialValues: T;
  onSuccess: () => void;
  updateMethod: (values: T) => Promise<any>;
  label: string;
  options?: Partial<Options>;
};

const UserForm = <T extends CreateUserBody | UpdateUserBody>({
  initialValues,
  onSuccess,
  updateMethod,
  label,
  options = {},
}: Props<T>) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateMethod,
    onSuccess: onSuccess,
  });

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async (values: T) => {
    mutate({ ...values, avatar: selectedImage });
  };

  const formOptions = { ...defaultOptions, ...options };

  return (
    <AppForm
      initialValues={{ ...initialValues }}
      validationSchema={getSchema(formOptions)}
      onSubmit={handleSubmit}
    >
      <View>
        {isError && <ErrorMessage error={error} />}
        <AppTextField
          name="email"
          label="Email"
          autoComplete="email"
          keyboardType="email-address"
          disabled={isPending}
        />
        {formOptions.showPassword && (
          <AppTextField
            name="password"
            label="Password"
            secureTextEntry={true}
            disabled={isPending}
          />
        )}
        <AppTextField name="username" label="Username" disabled={isPending} />
        <AppTextField
          name="first_name"
          label="First name"
          disabled={isPending}
        />
        <AppTextField name="last_name" label="Last name" disabled={isPending} />
        <AppSwitch
          name="condition"
          label="Do you agree with our conditions?"
          disabled={isPending}
        />
        <Button title="Pick an avatar" onPress={handleImagePick} />
        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={{ width: 100, height: 100 }}
          />
        )}
        <AppSubmitButton disabled={isPending}>{label}</AppSubmitButton>
      </View>
    </AppForm>
  );
};

export default UserForm;