import { StyleProp, StyleSheet } from "react-native";
import { Variables } from "@style";
import Text from "../Text/Text";
import AvatarBase from "./AvatarBase";

type Props = {
  style?: StyleProp<Object>;
  children: string;
};

const TextAvatar = ({ children, style }: Props) => {
  return (
    <AvatarBase style={style}>
      <Text style={styles.text}>{children}</Text>
    </AvatarBase>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: Variables.textSizes.xxl,
    fontFamily: Variables.fonts.bold,
  },
});

export default TextAvatar;
