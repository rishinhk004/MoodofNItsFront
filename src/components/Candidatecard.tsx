"use client";
import React from "react";
import Image from "next/image";

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
    <div
      className="m-4 flex max-w-lg items-center rounded-2xl border border-gray-700 bg-[#1c1c1e] text-white shadow-md transition hover:shadow-lg
                 sm:w-72 sm:flex-col sm:max-w-none"
    >
      {/* Image Container */}
      <div className="flex-shrink-0 p-3 sm:w-full sm:p-4 sm:pb-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={96}
            height={96}
            // Mobile: fixed size square. Desktop: responsive square.
            className="h-24 w-24 rounded-xl object-cover sm:h-auto sm:w-full sm:aspect-square"
          />
        ) : (
          <div
            className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-700 text-3xl font-semibold 
                       sm:h-auto sm:w-full sm:aspect-square"
          >
            {name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-grow px-4 py-2 text-left sm:w-full sm:px-5 sm:py-4 sm:text-center">
        <h2 className="truncate text-sm md:text-lg font-semibold sm:whitespace-normal font-sans">
          {name}
        </h2>
        <p className="truncate text-sm text-gray-400 sm:whitespace-normal font-serif">
          {position}
        </p>
      </div>
    </div>
  );
};

export default CandidateCard;