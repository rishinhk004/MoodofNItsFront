import React from 'react';

const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-black/60 backdrop-blur-sm border-b border-gray-800 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
         <div className="flex items-center space-x-2">
            <img
    src="https://res.cloudinary.com/dz2mlxltd/image/upload/e_background_removal/f_png/v1754242529/istockphoto-164420490-612x612_scn3x8.jpg"
    alt="Mood icon"
    className="w-12 h-6"
  />
  <span className="text-1xl font-light text-white tracking-tight">GUB Elections 2025</span>
  
</div>
        </div>
        <div className="flex items-center space-x-6">
          <a
            href="#"
            className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm font-medium"
          >
            Home
          </a>
          <a
            href="https://www.youtube.com/watch?v=Ru_qERUNxlY"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm font-medium"
          >
            Contact
          </a>
          
        </div>
      </nav>
    </header>
  );
};

export default Navbar;