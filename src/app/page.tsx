import React from 'react';

import ComingSoonButton from '../components/ComingSoon';

const MainContent: React.FC = () => {
  return (
    <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-red-500/5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-red-500/5 blur-3xl"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-6xl font-bold mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-tight">
            GUB Elections  2025
          </h1>
          <div className="text-4xl sm:text-5xl lg:text-4xl font-bold text-white-500 mb-6 tracking-wide">
           
          </div>

          {/* 📸 Image from Cloudinary */}
<div className="mb-12">
  <img
    src="https://res.cloudinary.com/dz2mlxltd/image/upload/v1754242015/Screenshot_2025-08-03_225537_ngnaaf.png" // your Cloudinary link here
    alt="Elections visual"
    className="mx-auto rounded-xl shadow-lg w-[500px] h-[300px] object-cover"
  />
</div>

          <ComingSoonButton />
        </div>
      </div>
    </main>
  );
};

export default MainContent;
