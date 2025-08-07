"use client";
import React from "react";
import { Heart, User, Calendar, MessageCircle } from "lucide-react";

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  likes: number;
  commentCount?: number;
  likedByCurrentUser: boolean;
  onLike: () => void;
  author?: string;
  date?: string;
  isAuthenticated?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  likes,
  commentCount,
  likedByCurrentUser,
  onLike,
  author,
  date = new Date().toISOString(),
  isAuthenticated = true,
}) => {
  const formattedDate = new Date(date ?? "").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span className="truncate">{author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }} 
            className={`flex-shrink-0 ml-4 p-2 rounded-lg transition-colors ${
              isAuthenticated 
                ? "hover:bg-white/10" 
                : "hover:bg-white/5 cursor-pointer"
            }`}
            title={!isAuthenticated ? "Login to like this post" : ""}
          >
            <Heart
              size={20}
              className={`transition-all duration-200 ${
                likedByCurrentUser 
                  ? "fill-red-500 text-red-500 scale-110" 
                  : isAuthenticated
                    ? "text-gray-400 group-hover:text-red-400"
                    : "text-gray-500 group-hover:text-gray-400"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="px-6 pb-4">
          <div className="relative overflow-hidden rounded-xl bg-white/5">
            <img
              src={imageUrl}
              alt="Post"
              className="w-full max-h-96 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 pb-6">
        <p className="text-gray-300 line-clamp-3 mb-4 leading-relaxed">
          {description}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Heart size={14} className={likedByCurrentUser ? "fill-red-500 text-red-500" : ""} />
              <span>{likes} like{likes !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={14} />
              <span>{commentCount ?? 0} comment{(commentCount ?? 0) !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="text-[10px] text-gray-500">
            Click to view details
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
