"use client";

import { useState } from "react";
import { FcGoogle } from 'react-icons/fc';
import { auth } from "~/lib/firebase";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import axios from "axios";
import type { AxiosError } from "axios";
import { env } from "~/env";
import { useRouter } from "next/navigation";

const GoogleLogin = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const [token, setToken] = useState<string | null>(null);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (!result) return;
      const firebaseToken = await result.user.getIdToken();
      setToken(firebaseToken);

      try {
        await axios.get(`${env.NEXT_PUBLIC_API_URL}/user`, {
          headers: { Authorization: `Bearer ${firebaseToken}` },
        });
        toast.success(`Welcome back, ${result.user.displayName ?? "User"}!`);
        router.back();
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          (err as AxiosError).response?.status === 404
        ) {
          setShowUsernamePrompt(true);
        } else {
          toast.error("Something went wrong");
          console.error(err);
        }
      }
    } catch (err) {
      toast.error("Google Sign-In failed");
      console.error(err);
    }
  };

  const handleUsernameSubmit = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    try {
      await axios.post(
        `${env.NEXT_PUBLIC_API_URL}/user`,
        { username },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Account created successfully!");
      setShowUsernamePrompt(false);
      router.back();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create account",
      );
    }
  };

  return (
    <div className="space-y-4">
      <Button
  onClick={handleGoogleSignIn}
  disabled={loading}
  className="bg-white text-black border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  <FcGoogle className="text-xl" />
  {loading ? "Signing in..." : "Continue with Google"}
</Button>

      {error && <p className="mt-2 text-red-500">{error.message}</p>}

      {showUsernamePrompt && (
        <div className="space-y-2">
          <Input
            placeholder="Enter a anonymous username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button onClick={handleUsernameSubmit}>Create Account</Button>
        </div>
      )}
    </div>
  );
};

export default GoogleLogin;
