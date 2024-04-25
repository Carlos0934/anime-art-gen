import { useCallback, useEffect, useState } from "react";

export const useToken = () => {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token") || sessionStorage.getItem("token")
  );
  const removeToken = useCallback(() => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
  }, []);

  const storeToken = useCallback((token: string, remember: boolean) => {
    setToken(token);
    if (remember) {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "token") {
        setToken(event.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return { removeToken, storeToken, token };
};
