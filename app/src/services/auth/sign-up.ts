type SignUpInput = {
  email: string;
  password: string;
};

export const signUp = async (data: SignUpInput) => {
  const url = `${import.meta.env.VITE_API_URL}/auth/register`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status === 409) throw new Error("Email already in use");

  if (!response.ok) throw new Error("An error occurred");

  const json = (await response.json()) as { token: string };

  return json.token;
};
