"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ImagePlus, Send, X } from "lucide-react";
import { toast } from "sonner";
import { env } from "~/env";
import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import { auth } from "~/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface CreatePostOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

interface ApiResponse<T> {
  msg: T;
  status: number;
}

const CreatePostOverlay: React.FC<CreatePostOverlayProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("TEXT");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const createPost = async (formData: FormData): Promise<ApiResponse<unknown>> => {
    const { data } = await API.post<ApiResponse<unknown>>("/post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!title || !description || !type) {
      toast.error("Title, description, and type are required");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    if (file) formData.append("photo", file);

    try {
      await createPost(formData);
      toast.success("Post created successfully!");
      setTitle("");
      setDescription("");
      setType("TEXT");
      setFile(null);
      onPostCreated();
      onClose();
    } catch (error) {
      const axiosError = error as AxiosError<{ msg?: string }>;
      toast.error(axiosError.response?.data?.msg ?? "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setDescription("");
      setType("TEXT");
      setFile(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-black border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create Post</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Post Title */}
          <div>
            <label className="block mb-3 text-sm font-medium text-gray-300">
              Title
            </label>
            <Input
              placeholder="Enter your post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-3 text-sm font-medium text-gray-300">
              Description
            </label>
            <Textarea
              placeholder="Write something..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 transition-colors min-h-[120px]"
            />
          </div>

          {/* Post Type */}
          <div>
            <label className="block mb-3 text-sm font-medium text-gray-300">
              Post Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg bg-white/10 border border-white/20 p-3 text-white focus:border-white/40 transition-colors"
            >
              <option value="" disabled>Select post type</option>
              <option value="TEXT">Text</option>
              <option value="PHOTO">Photo</option>
              <option value="VIDEO">Video</option>
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block mb-3 text-sm font-medium text-gray-300">
              Upload Image
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-dashed border-white/20 p-4 cursor-pointer text-gray-300 hover:bg-white/5 transition-colors">
              <ImagePlus size={20} />
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
            disabled={isSubmitting}
            className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                Posting...
              </>
            ) : (
              <>
                <Send size={18} />
                Post
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostOverlay; 