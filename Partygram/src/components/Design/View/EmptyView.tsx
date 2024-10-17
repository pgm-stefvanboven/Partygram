import { StyleSheet } from "react-native";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";
import Title from "@design/Text/Title";
import Text from "@design/Text/Text";
import { Variables } from "@style";
import CenteredView from "@design/View/CenteredView";
import SecondaryButton from "@design/Button/SecondaryButton";

type Props = {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
};

const EmptyView = ({ title, description, icon, onPress }: Props) => {
  return (
    <CenteredView>
      <Icons name={`${icon}-outline`} size={Variables.sizes.xxxl} color={Variables.colors.gray} />
      <Title style={[styles.title, styles.text]}>{title}</Title>
      <Text color="light" style={styles.text}>
        {description}
      </Text>
      <SecondaryButton onPress={onPress} style={styles.button}>
        Toevoegen
      </SecondaryButton>
    </CenteredView>
  );
};

const styles = StyleSheet.create({
  title: {
    marginVertical: Variables.sizes.xs,
  },
  text: {
    textAlign: "center",
    paddingHorizontal: Variables.sizes.large,
  },
  button: {
    marginTop: Variables.sizes.medium,
  },
});

export default EmptyView;
