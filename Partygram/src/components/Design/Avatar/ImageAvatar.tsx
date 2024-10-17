import { Image, ImageSourcePropType, StyleProp, StyleSheet } from "react-native";
import AvatarBase from "./AvatarBase";

type Props = {
  style?: StyleProp<Object>,  
  source: ImageSourcePropType;
}

const ImageAvatar = ({ style, source }: Props) => {
  return (
    <AvatarBase style={style}>
      <Image style={styles.image} source={source} resizeMode="cover" />
    </AvatarBase>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default ImageAvatar;
