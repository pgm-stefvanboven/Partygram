import IconButton from "./IconButton";
import { Variables } from "@style";

type Props = {
  icon: any;
  onPress?: () => void;
  title: string;
  color?: string;
};

const HeaderButton = ({ icon, title, color, onPress }: Props) => {
  return (
    <IconButton
      icon={icon}
      title={title}
      color={color || Variables.colors.headerText}
      size={Variables.sizes.xl}
      onPress={onPress}
    />
  );
};

export default HeaderButton;
