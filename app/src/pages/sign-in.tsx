import { Input } from "@/components/input";
import { Link } from "wouter";

export const SignInPage = () => {
  return (
    <section className="max-w-md mx-auto mt-24 p-6 bg-white shadow-lg ">
      <header className="text-center ">
        <h2 className="font-sans text-4xl font-semibold">Welcome</h2>
        <p className="text-gray-600 mt-2">Please sign in to continue.</p>
      </header>

      <main className="mt-6 px-4 mx-auto">
        <form className="space-y-5 ">
          <Input label="Email:" type="email" name="email" />
          <Input label="Password:" type="password" name="password" />
          <footer className="flex justify-between items-center">
            <label className=" text-sm flex items-center">
              <input type="checkbox" name="remember-me" className="mr-2" />
              Remember me
            </label>

            <Link href="/forgot-password" className="text-blue-500 font-sm">
              Forgot password?
            </Link>
          </footer>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 font-semibold text-white bg-black rounded-sm"
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
