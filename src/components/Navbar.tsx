import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <header className="mb-5 w-full border-b border-gray-800 bg-black/60 shadow-sm backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
            <img
              src="https://res.cloudinary.com/dz2mlxltd/image/upload/e_background_removal/f_png/v1754242529/istockphoto-164420490-612x612_scn3x8.jpg"
              alt="Mood icon"
              className="h-6 w-12"
            />
            <span className="text-1xl font-light tracking-tight text-white">
              GUB Elections 2025
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <a
            href="https://www.youtube.com/watch?v=Ru_qERUNxlY"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-red-400"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
