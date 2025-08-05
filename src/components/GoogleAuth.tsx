"use client";

import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "~/lib/firebase";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import axios from "axios"; 
import type { AxiosError } from "axios";
import { env } from "~/env";
import { useRouter } from "next/navigation";

const GoogleLogin = () => {
  const [signInWithGoogle, , loading, error] = useSignInWithGoogle(auth);
  const [_user] = useAuthState(auth);
  const [token, setToken] = useState<string | null>(null);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  // 1. Sign in handler
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (!result) return;

      const firebaseToken = await result.user.getIdToken();
      setToken(firebaseToken);

      // Check if user exists in your backend
      try {
        await axios.get(`${env.NEXT_PUBLIC_API_URL}/user`, {
          headers: { Authorization: `Bearer ${firebaseToken}` },
        });

        toast.success(`Welcome back, ${result.user.displayName ?? "User"}!`);
        router.push("/");
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

  // 2. Auto check backend after login
  useEffect(() => {
    const checkUserInDatabase = async () => {
      if (!_user) return;

      const firebaseToken = await _user.getIdToken();
      setToken(firebaseToken);

      try {
        await axios.get(`${env.NEXT_PUBLIC_API_URL}/user`, {
          headers: { Authorization: `Bearer ${firebaseToken}` },
        });

        toast.success(`Welcome back, ${_user.displayName ?? "User"}!`);
        router.push("/");
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
    };

    void checkUserInDatabase();
  }, [_user]);

  // 3. Handle username creation if user is new
  const handleUsernameSubmit = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    try {
      await axios.post(
        `${env.NEXT_PUBLIC_API_URL}/user`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Account created successfully!");
      setShowUsernamePrompt(false);
      router.push("/");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create account"
      );
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading || !!_user}
        className="bg-white text-black border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <FcGoogle className="text-xl" />
        {loading ? "Signing in..." : "Continue with Google"}
      </Button>

      {error && <p className="mt-2 text-red-500">{error.message}</p>}

      {showUsernamePrompt && (
        <div className="space-y-2 text-white-800">
          <Input
            placeholder="Enter an anonymous username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-transparent text-white border border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button onClick={handleUsernameSubmit}>Create Account</Button>
        </div>
      )}
    </div>
  );
};

export default GoogleLogin;
