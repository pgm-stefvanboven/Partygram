import { useFormikContext } from "formik";
import { useEffect } from "react";
import isVoid from "@core/utils/isVoid";
import SpinnerField, { SpinnerFieldProps } from "@design/Form/SpinnerField";

export type AppSpinnerFieldProps = {
  name: string;
  items: { label: string; value: string | number }[];
} & Omit<SpinnerFieldProps, "value" | "onChange">;

const AppSpinnerField = ({ name, items, ...rest }: AppSpinnerFieldProps) => {
  const { values, touched, errors, handleBlur, setFieldValue } = useFormikContext<Record<string, any>>();
  const hasError = errors[name] && touched[name];
  const value = values[name];

  // if no item is set, set the first item
  useEffect(() => {
    if (isVoid(value) && items.length > 0) {
      setFieldValue(name, items[0].value);
    }
  }, [value]);

  return (
    <SpinnerField
      name={name}
      value={value}
      onChange={(value: string | number) => setFieldValue(name, value)}
      onBlur={handleBlur(name)}
      items={items}
      error={hasError ? String(errors[name]) : null}
      {...rest}
    />
  );
};

export default AppSpinnerField;
