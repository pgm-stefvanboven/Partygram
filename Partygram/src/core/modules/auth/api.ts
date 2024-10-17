import { supabase } from "../../../core/api/supabase";
import { Session } from "@supabase/supabase-js";
import { CreateUserBody, UpdateUserBody } from "./types";
import { Bucket } from "../files/constants";
import * as FileSystem from "expo-file-system";

export const getCurrentSession = async (): Promise<Session | null> => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return null;
  }
  return session;
};

export type LoginBody = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: LoginBody) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    return Promise.reject(error);
  }
  return Promise.resolve(data.user);
};

export const logout = async () => {
  return supabase.auth.signOut();
};

export const createUser = async (user: CreateUserBody) => {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        condition: user.condition,
      },
    },
  });

  if (error) {
    return Promise.reject(error);
  }

  if (!data.user) {
    return Promise.reject(new Error("User creation failed"));
  }

  let avatar_url = null;
  if (user.avatar_url) {
    const fileName = `${data.user.id}/${Date.now()}.jpg`;
    const { error: uploadError } = await uploadImage(
      Bucket.Avatars,
      fileName,
      user.avatar_url
    );

    if (uploadError) {
      return Promise.reject(uploadError);
    }
    avatar_url = fileName;
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: data.user.id, // assuming the user's ID should be used as the profile ID
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar_url: avatar_url, // Optional avatar URL
    });

  if (profileError) {
    return Promise.reject(profileError);
  }

  return Promise.resolve(data.user);
};

export const updateUserAvatar = async (
  userId: string,
  selectedImage: string
) => {
  // Haal de geauthenticeerde gebruiker op
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error.message);
    throw new Error("Error getting user");
  }

  // Controleer of de userId overeenkomt met de geauthenticeerde gebruiker
  if (user && user.id !== userId) {
    throw new Error("Unauthorized user");
  }

  console.log("Authenticated user ID:", user?.id);

  // Upload de afbeelding
  const uploadResult = await uploadImage(
    "avatars",
    `${userId}/${Date.now()}.jpg`,
    selectedImage
  );

  if (uploadResult.error) {
    throw new Error(uploadResult.error.message);
  }

  // Update de avatar URL in de database
  const avatar_url = uploadResult.data.publicUrl;
  const { data, error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatar_url })
    .eq("id", userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return data ? data[0] : null;
};

// Functie om afbeelding te uploaden naar Supabase
// Functie om afbeelding te uploaden naar Supabase
const uploadImage = async (bucket: string, path: string, uri: string) => {
  const fileType = uri.substring(uri.lastIndexOf(".") + 1);

  // Lees het bestand van het bestandssysteem
  const response = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Upload het bestand naar Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, response, {
      contentType: `image/${fileType}`,
      upsert: true,
    });

  if (error) {
    console.log("Upload error:", error);
    return { error: new Error("Failed to upload image") };
  }

  const { publicUrl } = supabase.storage.from(bucket).getPublicUrl(path).data;
  console.log(`Image uploaded to: ${publicUrl}`);

  return {
    data: {
      publicUrl: publicUrl,
    },
  };
};
