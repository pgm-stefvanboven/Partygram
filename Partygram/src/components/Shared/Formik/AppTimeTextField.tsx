import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { formatTimeToString, parseStringToTime } from "@core/modules/logs/utils";
import TextField, { TextFieldProps } from "@design/Form/TextField";
import { StyleProp, ViewStyle } from "react-native";

const formatTime = (oldString: string, newString: string) => {
  if (newString.length > oldString.length) {
    newString = newString.replace(/\D+/g, "");
    if (newString.length > 2) {
      const before = newString.substring(0, newString.length - 2);
      const after = newString.substring(newString.length - 2, newString.length);
      return `${before}:${after}`;
    }
  }
  return newString;
};

const formatValueToTimeString = (value: string) => {
  return value && parseInt(value) > 0 ? formatTimeToString(parseInt(value)) : "";
};

type Props = {
  name: string;
  style?: StyleProp<ViewStyle>;
} & Omit<TextFieldProps, "value" | "onChangeText">;

const AppTimeTextField = ({ style, name, ...props }: Props) => {
  const { values, touched, errors, setFieldValue, setFieldTouched } = useFormikContext<Record<string, any>>();
  const value = values[name];
  const hasError = errors[name] && touched[name];

  const [time, setTime] = useState(formatValueToTimeString(value));

  const handleBlur = () => {
    setFieldValue(name, parseStringToTime(time));
    setTimeout(() => setFieldTouched(name, true), 200); // todo: something better :-)
  };

  const handleChangeText = (newTime: string) => {
    setTime(formatTime(time, newTime));
  };

  useEffect(() => {
    setTime(formatValueToTimeString(value));
  }, [value]);

  return (
    <TextField
      name={name}
      style={style}
      value={time}
      onBlur={handleBlur}
      onChangeText={handleChangeText}
      keyboardType="numeric"
      placeholder="00:00"
      error={hasError ? String(errors[name]) : null}
      {...props}
    />
  );
};

export default AppTimeTextField;
