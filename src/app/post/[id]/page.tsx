"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";
import Card from "../../../components/Card";
import { env } from "~/env";
import { auth } from "~/lib/firebase";

interface PostProps {
  params: {
    id?: string;
  };
}

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  likes: number;
  likedByCurrentUser: boolean;
  author: {
    id: string;
    username: string;
  };
createdAt: string;  
}

interface ApiResponse<T> {
  status: string;
  msg:T;
}

const Post = ({ params }: PostProps) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [post, setPost] = useState<Post | null>(null);

  const API: AxiosInstance = axios.create({
    baseURL: `${env.NEXT_PUBLIC_API_URL}`,
  });

  API.interceptors.request.use(async (config) => {
    const token = user ? await user.getIdToken() : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    if (!params.id) return;

    const fetchPost = async () => {
      return toast.promise(
        API.get<ApiResponse<Post>>(`/post/${params.id}`),
        {
          loading: "Fetching post...",
          success: (res) => {
            setPost(res.data.msg);
            return "Post fetched!";
          },
          error: "Failed to fetch post",
        }
      );
    };

    void fetchPost();
  }, [params.id]);

  const handleLike = async (postId: string): Promise<void> => {
    try {
      await API.post(`/like/${postId}`);
      setPost((prev) =>
        prev && prev.id === postId
          ? {
              ...prev,
              likes: prev.likedByCurrentUser ? prev.likes - 1 : prev.likes + 1,
              likedByCurrentUser: !prev.likedByCurrentUser,
            }
          : prev
      );
    } catch (err) {
      const axiosError = err as AxiosError<{ msg?: string }>;
      toast.error(axiosError.response?.data?.msg ?? "Error liking post");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      {!params.id ? (
        <h1>No Post ID provided</h1>
      ) : !post ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full max-w-2xl">
          {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute top-24 left-20"
      >
        <span
          className="flex items-center gap-2 rounded-md bg-blue/60 hover:bg-black/80 px-4 py-2 text-sm font-semibold shadow transition border border-white/50"
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          ← Back to Home
        </span>
      </Link>
          <Card
            key={post.id}
            title={post.title}
            description={post.description}
            imageUrl={post.imageUrl}
            likes={post.likes}
            likedByCurrentUser={post.likedByCurrentUser}
            onLike={() => handleLike(post.id)}
            author={post.author.username}
            date={post.createdAt}
          />
        </div>
      )}
    </div>
  );
};

export default Post;
