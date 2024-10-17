import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { DefaultStyles, Variables } from "@style";
import FieldError from "./FieldError";
import Label from "./Label";
import isEmptyText from "@core/utils/isEmptyText";

type Props = {
  style?: StyleProp<ViewStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
  label?: string;
  error?: string;
  children: React.ReactNode;
};

const BaseTextField = ({ style, backgroundStyle, label, error, children }: Props) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Label>{label}</Label>}
      <View style={[styles.background, backgroundStyle, !isEmptyText(error) && styles.backgroundError]}>
        {children}
      </View>
      {!isEmptyText(error) && <FieldError>{error}</FieldError>}
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

export default BaseTextField;
