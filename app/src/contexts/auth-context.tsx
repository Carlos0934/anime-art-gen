import { useToken } from "@/hooks/use-token";
import { signIn } from "@/services/auth/sign-in";
import { getProfile } from "@/services/user/get-profile";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  isLoading?: boolean;
  signIn: (data: {
    email: string;
    password: string;
    remember: boolean;
  }) => Promise<void>;
  signOut: () => void;
  user: {
    id: string;
    email: string;
    createdAt: string;
    credits: number;
  } | null;
};

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { storeToken, removeToken, token } = useToken();

  useEffect(() => {
    setIsLoading(true);
    if (!token) {
      setIsLoading(false);

      return;
    }

    getProfile(token)
      .then(setUser)
      .catch((error) => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, removeToken]);

  const signInFn = useCallback(
    async (data: { email: string; password: string; remember: boolean }) => {
      const token = await signIn(data);
      const user = await getProfile(token);

      if (!user) {
        throw new Error("Invalid credentials");
      }

      storeToken(token, data.remember);
    },
    [storeToken]
  );

  const signOut = useCallback(() => {
    removeToken();
    setUser(null);
  }, [removeToken]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        signIn: signInFn,
        signOut,
        user: user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
