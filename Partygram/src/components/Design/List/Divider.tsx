import { StyleSheet, View } from "react-native";
import { Variables } from "@style";

const Divider = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: Variables.colors.background,
  },
});

export default Divider;
