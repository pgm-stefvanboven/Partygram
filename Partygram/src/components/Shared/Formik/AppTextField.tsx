import TextField, { TextFieldProps } from "../../Design/Form/TextField";
import { useFormikContext } from "formik";

type Props = Omit<TextFieldProps, "value" | "onChangeText">;

const AppTextField = ({ name, ...rest }: Props) => {
  const { values, errors, touched, setFieldValue, handleBlur } = useFormikContext<Record<string, any>>();
  const hasError = errors[name] && touched[name];

  return (
    <TextField
      name={name}
      value={values[name]}
      onChangeText={(text: string) => setFieldValue(name, text)}
      onBlur={handleBlur(name)}
      error={hasError ? String(errors[name]) : null}
      {...rest}
    />
  );
};

export default AppTextField;
