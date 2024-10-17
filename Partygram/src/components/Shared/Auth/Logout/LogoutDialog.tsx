import { logout } from "@core/modules/auth/api";
import AlertDialog from "@design/Dialog/AlertDialog";

type Props = {
  onDismiss: () => void;
};

const LogoutDialog = ({ onDismiss }: Props) => {
  const handleDismiss = () => {
    onDismiss();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <AlertDialog
      title="Are you sure you want to logout?"
      onDismiss={handleDismiss}
      onAction={handleLogout}
      actionText="Logout"
    />
  );
};

export default LogoutDialog;
