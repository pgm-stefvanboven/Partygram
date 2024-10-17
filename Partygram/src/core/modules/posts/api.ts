import { supabase } from "../../../core/api/supabase";
import { CreatePostBody, UpdatePostBody } from "./types";

export const getPosts = async () => {
  const response = await supabase
  .from("posts")
  .select("*");
  return Promise.resolve(response.data);
};

export const getPost = async (uid: string | number) => {
  const response = await supabase
  .from("posts")
  .select("*")
  .eq("id", uid)
  return Promise.resolve(response.data);
};

export const fetchUserPosts = async (uid: string | number) => {
  const response = await supabase
  .from("posts")
  .select("*")
  .eq("user_id", uid)
  return Promise.resolve(response.data);
}

export const createPost = async (post: CreatePostBody) => {
  const response = await supabase
  .from("posts")
  .insert(post);
  return Promise.resolve(response.data);
};

export const updatePost = async (post: UpdatePostBody) => {
    const response = await supabase.from("posts").update(post).eq("id", post.id).select().throwOnError().single();
    return Promise.resolve(response.data);
  };

export const deletePost = async (uid: number) => {
    const response = await supabase.from("posts").delete().eq("id", uid).throwOnError();
    return Promise.resolve(response.data);
  };