import React from "react";

import ComingSoonButton from "../components/ComingSoon";

const MainContent: React.FC = () => {
  return (
    <main className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="mx-auto max-w-4xl text-center">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-red-500/5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-red-500/5 blur-3xl"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <h1 className="mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-2xl font-bold leading-tight text-transparent sm:text-3xl lg:text-6xl">
            GUB Elections 2025
          </h1>
          <div className="text-white-500 mb-6 text-4xl font-bold tracking-wide sm:text-5xl lg:text-4xl"></div>

          {/* 📸 Image from Cloudinary */}
          <div className="mb-12">
            <img
              src="https://res.cloudinary.com/dz2mlxltd/image/upload/v1754242015/Screenshot_2025-08-03_225537_ngnaaf.png" // your Cloudinary link here
              alt="Elections visual"
              className="mx-auto h-[300px] w-[500px] rounded-xl object-cover shadow-lg scale-[.85] sm:scale-100"
            />
          </div>

          <ComingSoonButton />
        </div>
      </div>
    </main>
  );
};

export default MainContent;
