import { supabase } from "@core/api/supabase";

export const getPublicUrl = (bucket: string, filename: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data?.publicUrl;
};
