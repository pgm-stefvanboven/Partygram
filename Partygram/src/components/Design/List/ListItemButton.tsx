import { ColorValue, Pressable, StyleSheet, View } from "react-native";
import { Variables } from "@style";
import Text from "../Text/Text";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";

type Props = {
  onPress: () => void;
  title: string;
  color?: ColorValue;
  icon?: any;
  iconColor?: ColorValue;
};

const ListItemButton = ({ onPress, title, color, icon, iconColor = Variables.colors.primary }: Props) => {
  return (
    <Pressable onPress={onPress} android_ripple={{ color: Variables.colors.ripple, foreground: true }}>
      <View style={styles.container}>
        {icon && <Icons style={styles.icon} name={icon} color={iconColor} size={Variables.sizes.xl} />}
        <Text style={[styles.text, icon && styles.textWithIcon, color && { color }]}>{title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Variables.sizes.horizontalPadding,
    paddingVertical: Variables.sizes.small,
    backgroundColor: Variables.colors.white,
  },
  text: {
    color: Variables.colors.primary,
  },
  textWithIcon: {
    paddingRight: Variables.sizes.medium + Variables.sizes.xl, // center text instead of icon
  },
  icon: {
    marginRight: Variables.sizes.medium,
  },
});

export default ListItemButton;
