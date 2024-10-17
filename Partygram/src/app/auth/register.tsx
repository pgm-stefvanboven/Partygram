import useTitle from "../../core/hooks/useTitle";
import { createUser } from "../../core/modules/auth/api";
import DefaultView from "../../components/Design/View/DefaultView";
import UserForm from "../../components/Shared/User/UserForm";
import { useRouter, Href } from "expo-router";
import { StatusBar } from "expo-status-bar";

const RegisterScreen = () => {
  const router = useRouter();
  useTitle("Create account");

  return (
    <>
      <DefaultView>
        <UserForm
          updateMethod={createUser}
          onSuccess={() => router.push("/(app)/(tabs)" as Href<"/(app)/(tabs)">)}
          label="Create account"
          initialValues={{
            email: "",
            password: "",
            username: "",
            first_name: "",
            last_name: "",
            condition: false,
          }}
        />
      </DefaultView>
      <StatusBar style="light" />
    </>
  );
};

export default RegisterScreen;