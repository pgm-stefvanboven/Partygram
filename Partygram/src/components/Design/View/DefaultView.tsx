import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { Variables } from "../../../style";

type Props = {
  style?: StyleProp<ViewStyle>;
  padding?: boolean;
  children: React.ReactNode;
} & ViewProps;

const DefaultView = ({ style, padding = true, children, ...props }: Props) => {
  return (
    <View style={[styles.view, padding && styles.viewPadding, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  viewPadding: {
    paddingVertical: Variables.sizes.xl,
    paddingHorizontal: Variables.sizes.horizontalPadding,
  },
});

export default DefaultView;
