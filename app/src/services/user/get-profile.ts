export const getProfile = async (token: string) => {
  const url = `${import.meta.env.VITE_API_URL}/auth/profile`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) return null;

  if (!response.ok) throw new Error("An error occurred");

  const json = (await response.json()) as {
    user: { id: string; email: string; createdAt: string; credits: number };
  };

  return json.user;
};
