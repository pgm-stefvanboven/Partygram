import { supabase } from "../../../core/api/supabase";
import { decode } from "base64-arraybuffer";

export const uploadImage = async (bucket: string, filename: string, image: string) => {
  return await uploadFile(bucket, filename, image, {
    contentType: "image/png",
  });
};

export const uploadFile = async (bucket: string, filename: string, image: string, settings = {}) => {
  const { data, error } = await supabase.storage.from(bucket).upload(filename, decode(image), settings);

  if (error) {
    return Promise.reject(error);
  }
  return Promise.resolve(data);
};
