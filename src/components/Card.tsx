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
  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-xl border border-gray-700 bg-[#1c1c1e] text-white shadow-lg">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm text-white-400">
              <span className="text-sm text-gray-400 font-normal">Author:</span>{' '}
              <span className="font-semibold">{author}</span>
            </p>
            <p className="text-xs text-gray-400">
              Date: {new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>

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
        <p className="text-sm text-gray-200">Description: {description}</p>
        <p className="text-sm text-gray-400">Likes: {likes}</p>
      </div>
    </div>
  );
};

export default Card;
