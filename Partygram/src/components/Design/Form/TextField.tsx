import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import React from "react";
import isVoid from "../../../core/utils/isVoid";
import { DefaultStyles, Variables } from "../../../style";
import FieldError from "../../../components/Design/Form/FieldError";
import Label from "../../../components/Design/Form/Label";

export type TextFieldProps = TextInputProps & {
  name: string;
  value: string;
  label?: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  inputRef?: React.Ref<TextInput>;
  error?: string | null;
};

const TextField = ({
  name,
  value,
  label,
  onChangeText,
  placeholder,
  style,
  disabled = false,
  inputRef,
  error,
  ...rest
}: TextFieldProps) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Label>{label}</Label>}
      <View style={[styles.background, !isVoid(error) && styles.backgroundError]}>
        <TextInput
          style={styles.input}
          value={value}
          editable={!disabled}
          onChangeText={onChangeText}
          ref={inputRef}
          placeholder={placeholder}
          {...rest}
        />
      </View>
      {!isVoid(error) && <FieldError>{error}</FieldError>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: Variables.sizes.small,
  },
  background: {
    width: "100%",
    backgroundColor: Variables.colors.white,
    paddingVertical: Variables.sizes.small,
    paddingHorizontal: Variables.sizes.medium,
    borderRadius: Variables.sizes.xs,
    borderWidth: 1,
    borderColor: Variables.colors.white,
  },
  backgroundError: {
    borderColor: Variables.colors.error,
  },
  input: {
    ...DefaultStyles.text,
  },
});

export default TextField;
