import { supabase } from "../../../core/api/supabase";
import { UpdateProfileBody } from "./types";

// Define a type for the profile
interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  first_name: string;
  last_name: string;
}

export const fetchLoggedInUser = async (): Promise<Profile> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } else {
    throw new Error("No user is logged in");
  }
};

export const getProfiles = async () => {
  const { data, error } = await supabase.from("profiles").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getUserById = async (uid: string | number) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", uid);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchProfileById = async (uid: string | number) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", uid);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateProfile = async (profile: UpdateProfileBody) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", profile.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
