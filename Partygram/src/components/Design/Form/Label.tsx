import { StyleSheet } from "react-native";
import { Variables } from "../../../style";
import Text from "../Text/Text";

type Props = {
  children: string;
};

const Label = ({ children }: Props) => {
  return <Text style={styles.label}>{children}</Text>;
};

const styles = StyleSheet.create({
  label: {
    width: "100%",
    marginLeft: Variables.sizes.xs,
    marginBottom: Variables.sizes.xxs,
  },
});

export default Label;
