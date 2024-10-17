import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { format, parse } from "date-fns";
import { useFormikContext } from "formik";
import { useRef } from "react";
import { DATE_FORMAT } from "@core/constants";
import AppTextField from "../AppTextField";
import { TextInput } from "react-native";
import { TextFieldProps } from "@design/Form/TextField";

type Props = {
  name: string;
} & Omit<TextFieldProps, "value" | "onChangeText">;

const AppDatePickerField = (props: Props) => {
  const { name } = props;
  const { values, setFieldValue } = useFormikContext<Record<string, any>>();
  const value = values[name];
  const inputRef = useRef<TextInput>(null);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setFieldValue(name, selectedDate ? format(selectedDate, DATE_FORMAT) : null);
  };

  const handleFocus = () => {
    inputRef.current?.blur();

    DateTimePickerAndroid.open({
      value: value ? parse(value, DATE_FORMAT, new Date()) : new Date(),
      onChange: handleChange,
      mode: "date",
      is24Hour: true,
    });
  };

  const handleBlur = () => {
    // do nothing
  };

  return <AppTextField onFocus={handleFocus} onBlur={handleBlur} inputRef={inputRef} {...props} />;
};

export default AppDatePickerField;
