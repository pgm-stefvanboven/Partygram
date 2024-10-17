import { StyleProp, StyleSheet, TextProps, TextStyle } from "react-native";
import { Variables } from "../../../style";
import Text from "./Text";

type Props = TextProps & {
  children: string;
  style?: StyleProp<TextStyle>;
};

const Title = ({ style, children, ...props }: Props) => {
  return (
    <Text style={[styles.title, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: Variables.textSizes.xl,
  },
});

export default Title;
