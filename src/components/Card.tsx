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
    <div className="mx-auto w-[200px] overflow-hidden rounded-xl border border-gray-700 bg-[#1c1c1e] text-white shadow-lg">


      
      {/* Top Section (Author + Like) */}
      <div className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-white-400">
            <span className="text-sm text-gray-400 font-normal">Author:</span>{' '}
            <span className="font-semibold">{author}</span>
          </p>
          <p className="text-xs text-gray-400">Date: {formattedDate}</p>
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

      {/* Image or Placeholder */}
      {imageUrl && (
      <div className="mb-2 h-40 w-full overflow-hidden rounded-lg bg-gray-800 flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Post"
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          /> 
      </div>
      )}

      {/* Body */}
      <div className="p-4 pt-0 flex flex-col justify-between space-y-2 text-sm text-gray-300">
        <p className="line-clamp-3">{description}</p>
        <p className="text-xs text-gray-400">Likes: {likes}</p>
      </div>
    </div>
  );
};

export default Card;
