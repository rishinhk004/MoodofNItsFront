"use client";
import React, { useState } from "react";
import { Heart } from "lucide-react";

const Card: React.FC = () => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => setLiked(!liked);

  return (
    <div className="max-w-sm mx-auto bg-[#1c1c1e] text-white rounded-xl overflow-hidden shadow-lg border border-gray-700">
      
      
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/dz2mlxltd/image/upload/v1754370346/Screenshot_2025-08-05_103532_ljzswi.png"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">
              Lorem Ipsum
            </p>
            <p className="text-xs text-gray-400">5 Aug 2025</p>
          </div>
        </div>

      
        <button onClick={toggleLike} className="transition transform hover:scale-110">
          <Heart
            size={22}
            className={liked ? "text-red-500 fill-red-500" : "text-white"}
          />
        </button>
      </div>

      
      <div className="w-full">
        <img
          src="https://res.cloudinary.com/dz2mlxltd/image/upload/v1754370289/Screenshot_2025-08-05_103413_hrqrrk.png"
          alt="image"
          className="w-full h-auto object-cover"
        />
      </div>

      
      <div className="p-4 space-y-2">
        <button className="text-sm text-white bg-black px-3 py-1 rounded-md">Top Comment</button>
        <p className="text-sm text-gray-200">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
        </p>
      </div>
    </div>
  );
};

export default Card;
