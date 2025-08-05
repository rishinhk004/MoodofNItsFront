"use client";
import Card from "../../../components/Card";
import type { AxiosError, AxiosInstance } from "axios";
import { env } from "~/env";
import axios from "axios";
import { toast } from "sonner";
import { useState,useEffect } from "react";
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
}

interface ApiResponse<T> {
  status: string;
  msg: T;
}

const Post = ({ params }: PostProps) => {

  const API: AxiosInstance = axios.create({
    baseURL: `${env.NEXT_PUBLIC_API_URL}`,
  });
  const [post, setPost] = useState<Post | null>(null); 

  useEffect(() => {
    if (!params.id) return;

    const fetchPost = async () => {
      return toast.promise(
        API.get<ApiResponse<Post>>(`/post/${params.id}`),
        {
          loading: "Fetching post...",
          success: (res) => {
            setPost(res.data.msg);
            return "Post fetched successfully!";
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
    } catch (err: unknown) {
        const axiosError = err as AxiosError<{ msg?: string }>;
        toast.error(axiosError.response?.data?.msg ?? "Error liking post");
    }
    };

  return (
    <div className="flex flex-col items-center justify-center">
      {params.id ? <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row items-center justify-center">
            <div className="flex flex-col items-center justify-start">
                <button>Back</button>
            </div>
            <div className="flex flex-col items-start justify-center">
                {post && <Card
                    key={post.id}
                    title={post.title}
                    description={post.description}
                    imageUrl={post.imageUrl}
                    likes={post.likes}
                    likedByCurrentUser={post.likedByCurrentUser}
                    onLike={() => handleLike(post.id)}
                />}
            </div>
        </div>
      </div>: <h1>No Post ID provided</h1>}
    </div>
  );
};

export default Post;
