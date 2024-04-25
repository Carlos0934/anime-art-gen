type SignInInput = {
  email: string;
  password: string;
};
export const signIn = async (data: SignInInput) => {
  const url = `${import.meta.env.VITE_API_URL}/auth/login`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401) throw new Error("Invalid credentials");

  if (!response.ok) throw new Error("An error occurred");

  const json = (await response.json()) as { token: string };

  return json.token;
};
