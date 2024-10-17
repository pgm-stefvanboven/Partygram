import React from "react";
import { SwitchProps } from "../../Design/Form/Switch";
import { useFormikContext } from "formik";
import { View, Text, StyleSheet, Switch } from "react-native";

type Props = Omit<SwitchProps, "value" | "onChangeSwitch"> & {
  name: string;
  label: string;
};

const AppSwitch = ({ name, label, ...rest }: Props) => {
  const { values, errors, touched, setFieldValue, handleBlur } =
    useFormikContext<Record<string, any>>();
  const hasError = errors[name] && touched[name];

  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <Switch
        value={values[name]}
        onValueChange={(bool: boolean) => {
          setFieldValue(name, bool);
        }}
        {...rest}
      />
      {hasError && (
        <Text style={styles.errorText}>{errors[name]?.toString()}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

export default AppSwitch;