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
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    getProfile(token)
      .then((user) => {
        setUser(user);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const signInFn = useCallback(
    async (data: { email: string; password: string; remember: boolean }) => {
      try {
        setIsLoading(true);

        const token = await signIn(data);
        const user = await getProfile(token);

        if (!user) {
          throw new Error("Invalid credentials");
        }

        if (data.remember) {
          localStorage.setItem("token", token);
        }
        setUser(user);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        signIn: signInFn,
        signOut: signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
