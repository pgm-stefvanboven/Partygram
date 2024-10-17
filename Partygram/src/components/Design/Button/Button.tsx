import { ColorValue, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Variables } from "../../../style";
import Text from "../Text/Text";

type Props = {
  onPress: () => void;
  children: string;
  style?: StyleProp<ViewStyle>;
  color?: ColorValue;
  disabled?: boolean;
};

const Button = ({ onPress, children, style, color, disabled = false }: Props) => {
  return (
    <Pressable
      disabled={disabled}
      accessibilityLabel={children}
      onPress={onPress}
      style={style}
      android_ripple={{ color: Variables.colors.ripple, foreground: true }}
    >
      <View
        style={[
          styles.background,
          { backgroundColor: color ?? Variables.colors.primary },
          disabled && styles.backgroundDisabled,
        ]}
      >
        <Text style={[styles.title, disabled && styles.titleDisabled]}>{children}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: Variables.sizes.large,
    paddingVertical: Variables.sizes.medium,
    borderRadius: Variables.sizes.xs,
  },
  backgroundDisabled: {
    backgroundColor: Variables.colors.grayLight,
  },
  title: {
    textAlign: "center",
    color: Variables.colors.white,
    // fontFamily: Variables.fonts.bold,
    fontSize: Variables.textSizes.default,
  },
  titleDisabled: {
    opacity: 0.3,
    color: Variables.colors.text,
  },
});

export default Button;
