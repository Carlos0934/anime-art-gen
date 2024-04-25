import { useAuth } from "@/contexts/auth-context";
import { Redirect, Route } from "wouter";
import { Spinner } from "./spinner";

export const ProtectedRoute = ({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    console.log("Redirecting to sign-in page");
    console.log("user", user);
    return <Redirect to="/sign-in" />;
  }

  return <Route path={path}>{children}</Route>;
};
