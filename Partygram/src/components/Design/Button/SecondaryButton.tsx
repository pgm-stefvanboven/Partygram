import { Pressable, StyleProp, StyleSheet, View } from "react-native";
import { Variables } from "@style";
import Text from "../Text/Text";

type Props = {
  onPress: () => void;
  disabled?: boolean;
  children: string;
  style?: StyleProp<Object>;
};

const SecondaryButton = ({ onPress, children, style, disabled = false }: Props) => {
  return (
    <Pressable
      disabled={disabled}
      accessibilityLabel={children}
      onPress={onPress}
      style={style}
      android_ripple={{ color: Variables.colors.ripple, foreground: true }}
    >
      <View style={[styles.background, disabled && styles.backgroundDisabled]}>
        <Text style={[styles.title, disabled && styles.titleDisabled]}>{children}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: Variables.sizes.medium,
    paddingVertical: Variables.sizes.small,
    backgroundColor: Variables.colors.secondary,
    borderRadius: Variables.sizes.medium,
  },
  backgroundDisabled: {
    backgroundColor: Variables.colors.grayLight,
  },
  title: {
    textAlign: "center",
    color: Variables.colors.white,
    fontFamily: Variables.fonts.bold,
    fontSize: Variables.textSizes.default,
  },
  titleDisabled: {
    opacity: 0.3,
    color: Variables.colors.text,
  },
});

export default SecondaryButton;
