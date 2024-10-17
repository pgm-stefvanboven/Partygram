import isVoid from "../utils/isVoid";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

const useTitle = (title: string | null) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (!isVoid(title)) {
      navigation.setOptions({
        title: title,
      });
    }
  }, [title]);
};

export default useTitle;
