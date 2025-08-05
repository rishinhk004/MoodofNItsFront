"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ImagePlus, Send } from "lucide-react";
import { toast } from "sonner";
import { env } from "~/env";
import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import { auth } from "~/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Card from "./Card";

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

const PostPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("TEXT");
  const [file, setFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [user] = useAuthState(auth);

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

  const createPost = async (formData: FormData): Promise<void> => {
    const { data } = await API.post<ApiResponse<Post>>("/post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setPosts((prev) => [data.msg, ...prev]);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!title || !description || !type) {
      toast.error("Title, description, and type are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    if (file) formData.append("photo", file);

    toast.promise(
      (async () => {
        try {
          await createPost(formData);
          setTitle("");
          setDescription("");
          setType("TEXT");
          setFile(null);
          void fetchPosts();
        } catch (error) {
          const axiosError = error as AxiosError<{ msg?: string }>;
          throw new Error(axiosError.response?.data?.msg ?? "Failed to post");
        }
      })(),
      {
        loading: "Posting...",
        success: "Post created!",
        error: (err: AxiosError) => err.message ?? "Failed to post",
      },
    );
  };

  const handleLike = async (postId: string): Promise<void> => {
    try {
      await API.post(`/like/${postId}`, {
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
              ...p,
              likes: p.likedByCurrentUser ? p.likes - 1 : p.likes + 1,
              likedByCurrentUser: !p.likedByCurrentUser,
            }
            : p,
        ),
      );
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ msg?: string }>;
      toast.error(axiosError.response?.data?.msg ?? "Error liking post");
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="mb-6 text-3xl font-bold text-center text-white-800 tracking-wide uppercase">
        Create a Post
      </h2>

      <div className="space-y-5 rounded-xl bg-white p-6 shadow-lg">
        {/* Post Title */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
          <Input
            placeholder="Enter your post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-black border-gray-300"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <Textarea
            placeholder="Write something..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-black border-gray-300"
          />
        </div>

        {/* Post Type */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 pr-10 text-black bg-white "
          >
            <option value="" disabled>Select post type</option>
            <option value="TEXT">Text</option>
            <option value="PHOTO">Photo</option>
            <option value="VIDEO">Video</option>
          </select>

        </div>

        {/* File Upload */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Upload Image</label>
          <label className="flex items-center gap-2 rounded-md border border-dashed border-gray-300 p-2 cursor-pointer text-gray-700 hover:bg-gray-50 transition">
            <ImagePlus size={18} />
            <span className="text-sm">{file ? file.name : "Choose file"}</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-black hover:bg-black text-white font-medium py-2 flex justify-center items-center gap-2 rounded-md transition"
        >
          <Send size={16} /> Post
        </Button>
      </div>

      {/* Posts List */}
      <div className="mt-10 space-y-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            title={post.title}
            description={post.description}
            imageUrl={post.imageUrl}
            likes={post.likes}
            likedByCurrentUser={post.likedByCurrentUser}
            onLike={() => handleLike(post.id)}
          />
        ))}
      </div>
    </div>


  );
};

export default PostPage;
