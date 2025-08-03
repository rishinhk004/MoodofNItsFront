import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 mt-auto">
      <div className="border-t border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-200 hover:underline"
            >
              Privacy Policy
            </a>
            <div className="text-sm text-gray-500">
              © 2025 Mood of NITS. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;