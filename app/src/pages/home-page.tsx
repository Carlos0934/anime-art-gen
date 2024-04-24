import { Link } from "wouter";

export const HomePage = () => {
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
        <button>
          <Link href="/sign-in" className="text-blue-500 mt-5">
            Go to the About Page
          </Link>
        </button>
      </div>
    </div>
  );
};
