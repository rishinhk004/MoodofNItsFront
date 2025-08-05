"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ImagePlus, Send, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { env } from "~/env";
import axios, { AxiosError, AxiosInstance } from "axios";
import { getAuth } from "firebase/auth";

// ----- Interfaces -----

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  likes: number;
}

interface ApiResponse<T> {
  status: string;
  msg: T;
}

// ----- Main Component -----

const PostPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const auth = getAuth();

  const API: AxiosInstance = axios.create({
    baseURL: `${env.NEXT_PUBLIC_API_URL}/api`,
  });

  API.interceptors.request.use(async (config: any) => {
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const fetchPosts = async (): Promise<void> => {
    try {
      const { data } = await API.get<ApiResponse<Post[]>>("/post");
      setPosts(data.msg);
    } catch (error) {
      toast.error("Failed to fetch posts");
    }
  };

  useEffect(() => {
    void fetchPosts();
  }, []);

  const handleSubmit = async (): Promise<void> => {
    if (!title || !description) {
      toast.error("Title and description required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("photo", file);

    try {
      await toast.promise(
        API.post<ApiResponse<Post>>("/post", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        {
          loading: "Posting...",
          success: "Post created!",
          error: "Failed to post",
        }
      );

      setTitle("");
      setDescription("");
      setFile(null);
      void fetchPosts();
    } catch {
    }
  };

  const handleLike = async (postId: string): Promise<void> => {
    try {
      await API.post(`/like/${postId}`);
      void fetchPosts();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ msg?: string }>;
      toast.error(axiosError.response?.data?.msg ?? "Error liking post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Post Form */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
        <Input
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <ImagePlus size={20} />
          <span>{file ? file.name : "Upload Image"}</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <Button onClick={handleSubmit} className="w-full flex gap-2 items-center">
          <Send size={16} /> Post
        </Button>
      </div>

      {/* Post List */}
      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl p-4 shadow-md space-y-2">
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p>{post.description}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full rounded-md mt-2"
              />
            )}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleLike(post.id)}>
                <ThumbsUp size={16} className="mr-1" />
                {post.likes}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;
