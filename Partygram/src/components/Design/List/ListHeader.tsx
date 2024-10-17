import { StyleSheet, View } from "react-native";
import isVoid from "@core/utils/isVoid";
import { Variables } from "@style";
import Text from "../Text/Text";
import Title from "../Text/Title";

type Props = {
  title: string;
  description?: string;
  subTitle?: string;
  children?: React.ReactNode;
};

const ListHeader = ({ title, description, subTitle, children }: Props) => {
  const headerContent = (
    <View style={styles.container}>
      <View style={styles.containerText}>
        <Title>{title}</Title>
        {!isVoid(description) && <Text>{description}</Text>}
        {children}
      </View>
    </View>
  );

  if (isVoid(subTitle)) {
    return headerContent;
  }

  return (
    <View>
      {headerContent}
      <Text style={styles.subTitle}>{subTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Variables.colors.white,
    paddingHorizontal: Variables.sizes.horizontalPadding,
    paddingVertical: Variables.sizes.medium,
    marginBottom: Variables.sizes.xl,
  },
  containerText: {
    flex: 1,
  },
  subTitle: {
    paddingHorizontal: Variables.sizes.horizontalPadding,
    marginBottom: Variables.sizes.xxs,
  },
});

export default ListHeader;
