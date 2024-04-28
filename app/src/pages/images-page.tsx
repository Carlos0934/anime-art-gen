import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { TextArea } from "@/components/textarea";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "wouter";

const resolutions = [
  "1:1 (512x512)",
  "4:3 (512x384)",
  "16:9 (768x1280)",
  "9:16 (1280x768)",
] as const;
const qualities = {
  Low: 1,
  Medium: 2,
  High: 3,
} as const;
export const ImagesPage = () => {
  const { user, signOut } = useAuth();
  return (
    <div className="">
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <h1 className="text-3xl font-bold text-gray-700">
          Anime Art Generator
        </h1>

        <div className="flex ">
          <span className="mr-2">Credits:{user?.credits}</span>
          <Link href="/profile" className="text-blue-500">
            My Profile
          </Link>
          <button onClick={signOut} className="ml-4 text-red-500">
            Sign out
          </button>
        </div>
      </header>

      <main className="flex items-start justify-between max-w-screen-xl gap-8 px-5 py-5 mt-5">
        <section className="max-w-sm p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-semibold">Images</h2>
          <p className="text-gray-600 ">
            Here you can generate anime-style images using the AI model.
          </p>

          <form className="flex flex-col gap-y-3">
            <TextArea
              label="Prompt:"
              name="prompt"
              rows={2}
              maxLength={100}
              required
            />
            <TextArea
              maxLength={100}
              label="Negative Prompt:"
              name="negative"
              rows={2}
            />

            <Select
              label="Resolution:"
              name="resolution"
              options={resolutions}
            />
            <Select
              label="Quality:"
              name="quality"
              defaultValue={qualities.Medium}
              options={Object.keys(qualities)}
              getValue={(quality) =>
                qualities[quality as keyof typeof qualities]
              }
            />
            {/*
               <Input label="Seed:" name="seed" />
              */}

            <button
              type="submit"
              className="w-full mt-4 py-2.5 font-semibold text-white bg-black rounded-sm hover:bg-gray-800"
            >
              Generate Image
            </button>
          </form>
        </section>
        <section className="w-full max-w-md p-6 bg-white rounded shadow">
          <header>
            <img
              src="https://via.placeholder.com/768x1280"
              alt="Anime art"
              style={{ aspectRatio: "9/16" }}
              className="object-cover w-full h-80"
            />
          </header>
          <main className="mt-4">
            <p className="text-gray-600">
              {`Here is the generated image based on the prompt you provided.`}
            </p>
            <p>{`Negative prompt: ${"Negative Prompt"}`}</p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div>
                <h3 className="text-lg font-semibold">Quality</h3>
                <p>{`Quality`}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Resolution</h3>
                <p>{`Resolution`}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Seed</h3>
                <p>{`Seed`}</p>
              </div>
            </div>
          </main>
          <footer>
            <button className="w-full mt-4 py-2.5 font-semibold text-white bg-black rounded-sm hover:bg-gray-800">
              Download Image
            </button>
          </footer>
        </section>
        <section className="w-full max-w-xs p-6 ml-auto bg-white rounded shadow">
          <h2 className="text-2xl font-semibold">Recent Images</h2>
          <div className="flex flex-col pt-4 mt-4 border-t border-gray-200 gap-y-4">
            <div className="flex items-center ">
              <img
                src="https://via.placeholder.com/150"
                alt="Anime art"
                className="w-24 h-24 rounded-sm"
              />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Image 1</h3>
                <p className="text-sm text-gray-600 text-nowrap">
                  Quality Medium | 512x512
                </p>
                <div className="flex justify-end mt-2 gap-x-2">
                  <button className="text-gray-600 hover:text-gray-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                      />
                    </svg>
                  </button>
                  <button className="text-red-500 hover:text-red-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
