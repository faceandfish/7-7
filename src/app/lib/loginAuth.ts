import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getUserInfo } from "../lib/action";
import { LoginCredentials, User, UserResponse } from "../lib/definitions";
import { setToken } from "./token";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const loginResponse = await login(credentials);
      if (loginResponse.code === 200) {
        setToken(loginResponse.data);
        console.log("loginResponse.data:", loginResponse.data);

        const userResponse = await fetch("/api/userinfo", {
          headers: { Authorization: `Bearer ${loginResponse.data}` },
        });

        const json = (await userResponse.json()) as UserResponse;
        console.log("🚀 ~ handleLogin ~ json:", json);

        if (json.code === 200) {
          router.push("/");
        } else {
          throw new Error("Failed to fetch user info");
        }
      } else {
        throw new Error(loginResponse.msg || "Login failed");
      }
      console.log("🚀 ~ handleLogin ~ loginResponse:", loginResponse);
      console.log("🚀 ~ handleLogin ~ loginResponse:", loginResponse);
      console.log("🚀 ~ handleLogin ~ loginResponse.data:", loginResponse.data);
      console.log("🚀 ~ handleLogin ~ loginResponse.data:", loginResponse.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error };
}
