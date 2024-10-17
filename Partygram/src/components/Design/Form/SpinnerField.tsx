import { StyleSheet, StyleProp, TextStyle } from "react-native";
import React, { Ref } from "react";
import { DefaultStyles, Variables } from "@style";
import { Picker, PickerProps } from "@react-native-picker/picker";
import BaseTextField from "./BaseTextField";

export type SpinnerFieldProps = {
  name: string;
  value: string;
  label?: string;
  onChange: (value: string | number) => void;
  style?: StyleProp<TextStyle>;
  placeholder?: string;
  items: { label: string; value: string | number }[];
  disabled?: boolean;
  error?: string | null;
  inputRef?: Ref<Picker<string | number>>;
} & PickerProps;

const SpinnerField = ({
  name,
  value,
  label,
  onChange,
  style,
  placeholder,
  items,
  disabled = false,
  inputRef,
  error,
  ...rest
}: SpinnerFieldProps) => {
  return (
    <BaseTextField label={label} style={style} backgroundStyle={styles.background} error={error}>
      <Picker
        selectedValue={value}
        style={styles.input}
        enabled={!disabled}
        onValueChange={onChange}
        dropdownIconColor={Variables.colors.text}
        ref={inputRef}
        {...rest}
      >
        {items.map((item) => (
          <Picker.Item key={item.label} label={item.label} value={item.value} />
        ))}
      </Picker>
    </BaseTextField>
  );
};

const styles = StyleSheet.create({
  background: {
    paddingVertical: 0,
  },
  input: {
    ...DefaultStyles.text,
  },
});

export default SpinnerField;
