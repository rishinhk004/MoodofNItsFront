"use client";
import React from "react";
import { Heart } from "lucide-react";

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  likes: number;
  likedByCurrentUser: boolean;
  onLike: () => void;
  author?: string;
  date?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  likes,
  likedByCurrentUser,
  onLike,
  author = "Lorem Ipsum",
  date = "5 Aug 2025",
}) => {
  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-xl border border-gray-700 bg-[#1c1c1e] text-white shadow-lg">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-semibold">{author}</p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>
        </div>

        <button
          onClick={onLike}
          className="transform transition hover:scale-110"
        >
          <Heart
            size={22}
            className={
              likedByCurrentUser ? "fill-red-500 text-red-500" : "text-white"
            }
          />
        </button>
      </div>

      {imageUrl && (
        <div className="w-full">
          <img
            src={imageUrl}
            alt="Post"
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      <div className="space-y-2 p-4">
        <p className="text-sm text-gray-200">{description}</p>
        <p className="text-sm text-gray-400">Likes: {likes}</p>
      </div>
    </div>
  );
};

export default Card;
