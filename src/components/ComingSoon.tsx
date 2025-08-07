"use client";
import React from "react";

const ComingSoonButton: React.FC = () => {
  const handleClick = () => {
    const feedSection = document.getElementById("feed");
    if (feedSection) {
      feedSection.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("Feed section not found.");
    }
  };

  return (
    <div className="flex scale-75 flex-col items-center space-y-6 sm:scale-100">
      <button
        onClick={handleClick}
        className={`group relative transform rounded-xl bg-red-600 px-20 py-6 text-2xl font-semibold transition-all duration-500 hover:scale-105 
          hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/50`}
      >
        {/* Glowing effect */}
        <div className="absolute inset-0 animate-pulse rounded-xl bg-red-500 opacity-75 blur-lg transition-opacity duration-300 group-hover:animate-none group-hover:opacity-100"></div>

        {/* Button content */}
        <div className="relative flex items-center space-x-4">
          <span>LESSGOO!!</span>
        </div>

        {/* Shimmer effect */}
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"></div>
      </button>
    </div>
  );
};

export default ComingSoonButton;
