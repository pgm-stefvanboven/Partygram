import isVoid from "@core/utils/isVoid";
import { Bucket } from "../files/constants";
import { getPublicUrl } from "../files/utils";
import { User } from "./types";

export const getAvatarUrl = (user?: User | null) => {
  if (!user || isVoid(user.avatar)) {
    return null;
  }
  return getPublicUrl(Bucket.Avatars, user.avatar);
};
