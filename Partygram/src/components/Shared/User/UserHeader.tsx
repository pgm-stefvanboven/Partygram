import ListHeaderAvatar from "@design/List/ListHeaderAvatar";
import { useAuthContext } from "../Auth/AuthProvider";
import TextAvatar from "@design/Avatar/TextAvatar";
import UserEditableAvatar from "./UserAvatar";

type Props = {
  onPress: () => void;
};

const UserHeader = ({ onPress }: Props) => {
  const { user } = useAuthContext();
  if (!user) {
    return null;
  }
  return (
    <ListHeaderAvatar
      title={`${user.first_name} ${user.last_name}`}
      description={user.email}
      avatar={<UserEditableAvatar />}
      onPress={onPress}
    />
  );
};

export default UserHeader;
