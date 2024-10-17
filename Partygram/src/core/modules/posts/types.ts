import { Body, Tables } from "../../../../database.types";
import { Profile } from "../profiles/types";

export type Post = Tables<"posts">;

export type PostWithRelations = Post & { user_id: Profile };

export type Posts = PostWithRelations[];

export type CreatePostBody = Body<"posts">["Insert"];
export type UpdatePostBody = Body<"posts">["Update"];