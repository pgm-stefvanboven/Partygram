import { ColorValue, Pressable, StyleSheet, View } from "react-native";
import { Variables } from "@style";
import Text from "../Text/Text";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";
import isVoid from "@core/utils/isVoid";

type Props = {
  onPress: () => void;
  title: string;
  description?: string;
  icon?: any;
  iconColor?: ColorValue;
  color?: ColorValue;
  right?: string;
};

const ListItem = ({
  onPress,
  title,
  description,
  icon,
  iconColor = Variables.colors.text,
  color,
  right,
}: Props) => {
  let textContent: React.ReactNode;
  if (!isVoid(description)) {
    textContent = (
      <View style={styles.containerText}>
        <Text style={[styles.title, color && { color }]}>{title}</Text>
        <Text style={[styles.description]}>{description}</Text>
      </View>
    );
  } else {
    textContent = (
      <Text style={[styles.titleFlex, color && { color }]}>{title}</Text>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: Variables.colors.ripple, foreground: true }}
    >
      <View style={styles.container}>
        {icon && (
          <Icons
            style={styles.icon}
            name={icon}
            color={iconColor}
            size={Variables.sizes.xl}
          />
        )}
        {textContent}
        {right && (
          <Text style={[styles.right, color && { color }]}>{right}</Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Variables.sizes.horizontalPadding,
    paddingVertical: Variables.sizes.medium,
    backgroundColor: Variables.colors.white,
  },
  containerText: {
    flex: 1,
  },
  title: {},
  titleFlex: {
    flex: 1,
  },
  description: {
    color: Variables.colors.gray,
  },
  right: {
    marginLeft: "auto",
  },
  icon: {
    marginLeft: Variables.sizes.xs,
    marginRight: Variables.sizes.medium,
  },
});

export default ListItem;
