import { supabase } from "../../api/supabase";

export const getLikeByPostAndOwner = async (postId: string, userId: string) => {
  const { data, error } = await supabase
    .from("post_likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return null;
  }

  // Assuming the combination of postId and userId should be unique
  if (data.length === 1) {
    return data[0];
  }

  return null;
};

export const createLike = async (postId: string, userId: string) => {
  const { error } = await supabase.from("post_likes").insert([
    {
      post_id: postId,
      user_id: userId,
    },
  ]);
  if (error) {
    console.error(error);
  }
};

export const deleteLike = async (postId: string, userId: string) => {
  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);
  if (error) {
    console.error(error);
  }
};
