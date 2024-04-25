import { Input } from "@/components/input";
import { useAuth } from "@/contexts/auth-context";
import { signUp } from "@/services/auth/sign-up";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Link, useLocation, useRoute } from "wouter";

export const SignUpPage = () => {
  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate("/sign-in");
      toast.success("Account created check your email to verify", {
        duration: 5000,
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred");
      }
    },
  });

  const [_, navigate] = useLocation();
  const validatePasswordMatch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const password = event.currentTarget.form?.querySelector(
      "[name='password']"
    ) as HTMLInputElement;
    const confirmPassword = event.currentTarget;
    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity("Passwords do not match");
    } else {
      confirmPassword.setCustomValidity("");
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    signUpMutation.mutate({ email, password });
  };

  return (
    <section className="max-w-md p-6 mx-auto mt-24 bg-white shadow-lg ">
      <header className="text-center ">
        <h2 className="font-sans text-4xl font-semibold">
          Sign Up to your account
        </h2>
        <p className="mt-4 text-gray-600">
          Create an account to get started. 🚀
        </p>
      </header>

      <main className="px-4 mx-auto mt-6">
        <form className="space-y-5 " onSubmit={handleSubmit}>
          <Input label="Email:" type="email" name="email" />
          <Input label="Password:" type="password" name="password" />
          <Input
            onChange={validatePasswordMatch}
            label="Confirm Password:"
            type="password"
            name="confirm-password"
          />
          <button
            type="submit"
            disabled={signUpMutation.isPending}
            className="w-full mt-2 py-2.5 font-semibold text-white bg-black rounded-sm hover:bg-gray-800"
          >
            Sign Up
          </button>
        </form>
      </main>

      <footer className="mt-6 text-center">
        <p>
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-500">
            Sign In
          </Link>
        </p>
      </footer>
    </section>
  );
};
