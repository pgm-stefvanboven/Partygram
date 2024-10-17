import { useFormikContext } from "formik";
import { StyleSheet } from "react-native";
import { Variables } from "../../../style";
import Button from "../../Design/Button/Button";

type Props = {
  disabled?: boolean;
  children: string;
};

const AppSubmitButton = ({ disabled, children }: Props) => {
  const { handleSubmit, isValid } = useFormikContext();
  return (
    <Button style={styles.button} onPress={handleSubmit} disabled={disabled || !isValid}>
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: Variables.sizes.xs,
    width: "100%",
  },
});

export default AppSubmitButton;
