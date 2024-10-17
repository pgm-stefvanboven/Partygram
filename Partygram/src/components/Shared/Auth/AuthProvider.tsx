import useSupabaseAuth from "../../../core/api/useSupabaseAuth";
import { User } from "../../../core/modules/auth/types";
import { Session } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  user?: User | null;
  auth: Session | null;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  auth: null,
});

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const { isLoggedIn, isInitialized, auth, user } = useSupabaseAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        auth,
      }}
    >
      {isInitialized ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
