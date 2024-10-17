import { StyleProp, StyleSheet, View } from "react-native";
import { Variables } from "@style";

type Props = {
  style?: StyleProp<Object>;
  children: React.ReactNode;
};

const AvatarBase = ({ style, children }: Props) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: Variables.sizes.xxxxl,
    height: Variables.sizes.xxxxl,
    borderRadius: Variables.sizes.xxxxl,
    backgroundColor: Variables.colors.grayLight,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});

export default AvatarBase;
