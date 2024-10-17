import * as ImagePicker from "expo-image-picker";
import ListDialog from "@design/Dialog/ListDialog";

type Props = {
  onDismiss: () => void;
  onImage: (base64: string) => void;
};

const ImagePickerDialog = ({ onDismiss, onImage }: Props) => {
  const handlePress = async (type: string) => {
    try {
      const { status } =
        type === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status === "granted") {
        let method = type === "camera" ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;

        const { canceled, assets } = await method({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          base64: true,
        });
        if (!canceled && assets.length > 0 && assets[0].base64) {
          onImage(assets[0].base64);
        }
      }
    } catch (error) {
      console.log(error);
    }
    onDismiss();
  };

  return (
    <ListDialog onDismiss={onDismiss}>
      <ListDialog.Button onPress={() => handlePress("camera")}>Use camera</ListDialog.Button>
      <ListDialog.Button onPress={() => handlePress("library")}>Choose picture</ListDialog.Button>
    </ListDialog>
  );
};

export default ImagePickerDialog;
