import { Pressable } from "react-native";
import ImageAvatar from "@design/Avatar/ImageAvatar";
import TextAvatar from "@design/Avatar/TextAvatar";
import { useAuthContext } from "../Auth/AuthProvider";
import { updateUserAvatar } from "@core/modules/auth/api";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import LoadingAvatar from "@design/Avatar/LoadingAvatar";
import isVoid from "@core/utils/isVoid";
import ImagePickerDialog from "@design/ImagePicker/ImagePickerDialog";
import { getAvatarUrl } from "@core/modules/auth/utils";

const UserEditableAvatar = () => {
  const [showPicker, setShowPicker] = useState(false);
  const { user } = useAuthContext();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (file: string) => updateUserAvatar(file),
  });

  const handleAvatarPress = () => {
    setShowPicker(true);
  };

  useEffect(() => {
    if (isError) {
      alert(error);
    }
  }, [isError]);

  const handleImage = async (image: string) => {
    // hide picker
    setShowPicker(false);
    if (!isVoid(image)) {
      mutate(image);
    }
  };

  if (isPending) {
    return <LoadingAvatar />;
  }

  // get full path to avatar
  const avatarUrl = getAvatarUrl(user);

  if (!user) {
    return;
  }

  return (
    <>
      <Pressable onPress={handleAvatarPress}>
        {!avatarUrl ? (
          <TextAvatar>{`${user.first_name[0]}${user.last_name[0]}`}</TextAvatar>
        ) : (
          <ImageAvatar source={{ uri: avatarUrl }} />
        )}
      </Pressable>
      {showPicker && <ImagePickerDialog onDismiss={() => setShowPicker(false)} onImage={handleImage} />}
    </>
  );
};

export default UserEditableAvatar;
