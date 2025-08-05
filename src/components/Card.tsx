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
  author,
  date = new Date().toISOString(),
}) => {
  const formattedDate = new Date(date ?? "").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mx-auto w-[400px] rounded-2xl border border-gray-700 bg-[#1c1c1e] p-4 shadow-md transition hover:shadow-lg">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-sm text-gray-400">
            By <span className="font-medium text-white">{author ?? "Anonymous"}</span> • {formattedDate}
          </p>
        </div>
        <button onClick={onLike} className="mt-1 transition hover:scale-110">
          <Heart
            size={22}
            className={
              likedByCurrentUser ? "fill-red-500 text-red-500" : "text-gray-400"
            }
          />
        </button>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="mb-3 overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt="Post"
            className="h-48 w-full object-cover transition duration-300 hover:scale-105"
          />
        </div>
      )}

      {/* Body */}
      <div className="space-y-2 text-sm text-gray-300">
        <p>{description}</p>
        <p className="text-xs text-gray-400">Likes: {likes}</p>
      </div>
    </div>
  );
};

export default Card;
