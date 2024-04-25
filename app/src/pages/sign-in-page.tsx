import { Input } from "@/components/input";
import { Spinner } from "@/components/spinner";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

import { Link, Redirect, useLocation, useRoute } from "wouter";

export const SignInPage = () => {
  const [_, navigate] = useLocation();
  const { signIn, user, isLoading } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("remember-me") === "on";
    signIn({ email, password, remember: rememberMe })
      .then(() => {
        navigate("/images");
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred");
        }
      });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (user) {
    return <Redirect to="/images" />;
  }

  return (
    <section className="max-w-md p-6 mx-auto mt-24 bg-white shadow-lg ">
      <header className="text-center ">
        <h2 className="font-sans text-4xl font-semibold">Welcome</h2>
        <p className="mt-2 text-gray-600">Please sign in to continue.</p>
      </header>

      <main className="px-4 mx-auto mt-6">
        <form className="space-y-5 " onSubmit={handleSubmit}>
          <Input label="Email:" type="email" name="email" />
          <Input label="Password:" type="password" name="password" />
          <footer className="flex items-center justify-between">
            <label className="flex items-center text-sm ">
              <input type="checkbox" name="remember-me" className="mr-2" />
              Remember me
            </label>

            <Link href="/forgot-password" className="text-blue-500 font-sm">
              Forgot password?
            </Link>
          </footer>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 font-semibold text-white bg-black rounded-sm hover:bg-gray-800"
          >
            Sign In
          </button>
        </form>
      </main>

      <footer className="mt-6 text-center">
        <p>
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </footer>
    </section>
  );
};
