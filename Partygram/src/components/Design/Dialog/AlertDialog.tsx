import { useEffect } from "react";
import { Alert } from "react-native";

type Props = {
  onDismiss: () => void;
  onAction: () => void;
  title: string;
  description?: string;
  actionText: string;
};

const AlertDialog = ({ onDismiss, onAction, title, description, actionText }: Props) => {
  useEffect(() => {
    Alert.alert(
      title,
      description,
      [
        {
          text: "Cancel",
          onPress: () => onDismiss(),
          style: "cancel",
        },
        {
          text: actionText,
          onPress: () => onAction(),
        },
      ],
      {
        onDismiss,
      }
    );
  }, []);

  return null;
};

export default AlertDialog;
