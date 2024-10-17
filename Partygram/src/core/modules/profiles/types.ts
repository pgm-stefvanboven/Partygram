import { Body, Tables } from "../../../../database.types";

export type Profile = Tables<"profiles">;

export type CreateProfileBody = Body<"profiles">["Insert"];
export type UpdateProfileBody = Body<"profiles">["Update"];