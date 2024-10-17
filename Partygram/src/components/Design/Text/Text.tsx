import { StyleSheet, Text as RNText, StyleProp, TextStyle, TextProps } from "react-native";
import { DefaultStyles, Variables } from "../../../style";

type Props = TextProps & {
  children: string;
  color?: "default" | "light";
  style?: StyleProp<TextStyle>;
};

const Text = ({ children, color = "default", style, ...props }: Props) => {
  const dynamicStyle = {
    color: color === "light" ? Variables.colors.lightText : Variables.colors.text,
  };

  return (
    <RNText style={[styles.text, dynamicStyle, style]} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    ...DefaultStyles.text,
    fontSize: Variables.textSizes.default,
  },
});

export default Text;
