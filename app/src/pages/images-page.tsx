import { Spinner } from "@/components/spinner";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";

export const ImagesPage = () => {
  const [_, navigate] = useLocation();
  const { isLoading, user } = useAuth();
  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    navigate("/sign-in");
    return null;
  }

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Welcome to the Images Page</h1>
        <button>dsadsa</button>
      </div>
    </div>
  );
};
