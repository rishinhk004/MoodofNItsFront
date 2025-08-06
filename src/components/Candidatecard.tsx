"use client";
import React from "react";

interface CandidateCardProps {
  name: string;
  position: string;
  imageUrl?: string;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  name,
  position,
  imageUrl,
}) => {
  return (
    <div className="m-4 w-72 rounded-2xl border border-gray-700 bg-[#1c1c1e] text-white shadow-md transition hover:shadow-lg">
      {/* Image Section with Padding */}
      <div className="p-4 pb-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full aspect-square object-cover rounded-xl"
          />
        ) : (
          <div className="w-full aspect-square rounded-xl bg-gray-700 flex items-center justify-center text-3xl font-semibold">
            {name[0]}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="px-5 py-4 text-center space-y-1">
        <h2 className="text-lg font-semibold break-words">
          <span className="text-gray-400 font-normal">Name:</span> {name}
        </h2>
        <p className="text-sm text-gray-400 break-words">
          <span className="font-normal">Post:</span> {position}
        </p>
      </div>
    </div>
  );
};

export default CandidateCard;
