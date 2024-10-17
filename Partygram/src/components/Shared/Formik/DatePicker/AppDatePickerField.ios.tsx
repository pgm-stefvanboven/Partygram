import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { format, parse } from "date-fns";
import { useFormikContext } from "formik";
import { StyleSheet } from "react-native";
import { DATE_FORMAT } from "@core/constants";
import BaseTextField from "@design/Form/BaseTextField";
import { Variables } from "src/style/index";
import { TextFieldProps } from "@design/Form/TextField";

type Props = {
  name: string;
  disabled?: boolean;
} & Omit<TextFieldProps, "value" | "onChangeText">;

const AppDatePickerField = (props: Props) => {
  const { name, disabled } = props;
  const { values, errors, setFieldValue, touched } = useFormikContext<Record<string, any>>();
  const hasError = errors[name] && touched[name];
  const value = values[name];

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setFieldValue(name, selectedDate ? format(selectedDate, DATE_FORMAT) : null);
  };

  return (
    <>
      <BaseTextField
        {...props}
        error={hasError ? String(errors[name]) : ""}
        backgroundStyle={styles.background}
      >
        <DateTimePicker
          value={parse(value, DATE_FORMAT, new Date())}
          mode="date"
          display="inline"
          disabled={disabled}
          accentColor={Variables.colors.primary}
          textColor={Variables.colors.text}
          is24Hour={true}
          onChange={handleChange}
        />
      </BaseTextField>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    paddingVertical: Variables.sizes.xs,
    paddingHorizontal: Variables.sizes.xs,
  },
});

export default AppDatePickerField;
