import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("partygram", jsonValue);
  } catch (e) {
    return e;
  }
};

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("partygram");
    return jsonValue != null ? JSON.parse(jsonValue) : { likes: {} };
  } catch (e) {
    return Promise.reject(e);
  }
};
