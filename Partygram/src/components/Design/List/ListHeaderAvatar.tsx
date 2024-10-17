import { Pressable, StyleSheet, View } from "react-native";
import { Variables } from "@style";
import Text from "../Text/Text";
import Title from "../Text/Title";
import isEmptyText from "@core/utils/isEmptyText";

type Props = {
  title: string;
  description?: string;
  avatar: React.ReactNode;
  onPress: () => void;
};

const ListHeaderAvatar = ({ title, avatar, description, onPress }: Props) => {
  return (
    <Pressable
      style={styles.pressable}
      android_ripple={{ color: Variables.colors.ripple, foreground: true }}
      onPress={onPress}
    >
      <View style={styles.container}>
        {avatar}
        <View style={styles.containerText}>
          <Title>{title}</Title>
          {!isEmptyText(description) && <Text>{description}</Text>}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    marginBottom: Variables.sizes.xxl,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Variables.colors.white,
    paddingHorizontal: Variables.sizes.horizontalPadding,
    paddingVertical: Variables.sizes.medium,
  },
  containerText: {
    flex: 1,
    marginStart: Variables.sizes.medium,
  },
});

export default ListHeaderAvatar;
