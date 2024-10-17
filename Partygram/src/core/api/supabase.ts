import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  process.env.EXPO_PUBLIC_SUPABASE_KEY ?? "",
  {
    auth: {
      storage: AsyncStorage,
      detectSessionInUrl: false, // Prevents Supabase from evaluating window.location.href, breaking mobile,
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

export const AuthEvent = {
  SIGNED_IN: "SIGNED_IN",
  USER_UPDATED: "USER_UPDATED",
  TOKEN_REFRESHED: "TOKEN_REFRESHED",
  SIGNED_OUT: "SIGNED_OUT",
  USER_DELETED: "USER_DELETED",
};