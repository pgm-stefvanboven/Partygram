import { StyleProp } from "react-native";
import LoadingIndicator from "../LoadingIndicator";
import AvatarBase from "./AvatarBase";

type Props = {
  style?: StyleProp<Object>;
};

const LoadingAvatar = ({ style }: Props) => {
  return (
    <AvatarBase style={style}>
      <LoadingIndicator timeout={0} />
    </AvatarBase>
  );
};

export default LoadingAvatar;
