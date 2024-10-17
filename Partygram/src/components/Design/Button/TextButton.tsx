import { Pressable, StyleProp, StyleSheet } from "react-native";
import { Variables } from "../../../style";
import Text from "../Text/Text";

type Props = {
  onPress: () => void;
  children: string;
  color?: string;
  style?: StyleProp<Object>;
  disabled?: boolean;
};

const TextButton = ({ onPress, children, color, style, disabled = false }: Props) => {
  return (
    <Pressable
      disabled={disabled}
      accessibilityLabel={children}
      onPress={onPress}
      style={style}
      android_ripple={{ color: Variables.colors.ripple }}
    >
      <Text style={[styles.title, color && { color }]}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    color: Variables.colors.secondary,
    fontFamily: Variables.fonts.bold,
    fontSize: Variables.textSizes.default,
    paddingHorizontal: Variables.sizes.large,
    paddingVertical: Variables.sizes.medium,
  },
});

export default TextButton;
