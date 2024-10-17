import { StyleProp, StyleSheet, Switch, View, ViewStyle } from "react-native";
import isVoid from "../../../core/utils/isVoid";
import FieldError from "./FieldError";
import Label from "./Label";

export type SwitchProps = {
  name: string;
  value: boolean;
  label: string;
  onChangeSwitch: (bool: boolean) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  error?: string | null;
};

const SwitchComp = ({
  name,
  value,
  label,
  onChangeSwitch,
  style,
  disabled,
  error,
}: SwitchProps) => {
  return (
    <View style={[styles.container, style]}>
      <Label>{label}</Label>
      <Switch
        value={value}
        onValueChange={onChangeSwitch}
        disabled={disabled}
      />
      {!isVoid(error) && <FieldError>{error}</FieldError>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
  },
});

export default Switch;