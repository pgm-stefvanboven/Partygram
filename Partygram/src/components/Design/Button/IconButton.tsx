import { ColorValue, Pressable } from "react-native";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";
import { Variables } from "@style";

type Props = {
  icon: any;
  onPress?: () => void;
  title: string;
  color?: ColorValue;
  size?: number;
};

const IconButton = ({ icon, title, color, size, onPress }: Props) => {
  return (
    <Pressable accessibilityLabel={title} onPress={onPress} android_ripple={{ borderless: true }}>
      <Icons name={icon} color={color} size={size || Variables.sizes.xl} />
    </Pressable>
  );
};

export default IconButton;
