'use client';
import React, { useState, useEffect } from 'react';

const ComingSoonButton: React.FC = () => {
  const [clicked, setClicked] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  // Target time: 5th August 2:00 PM IST
  const targetDate = new Date('2025-08-05T14:00:00+05:30');

  useEffect(() => {
    if (!clicked) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft('00 hrs : 00 min : 00 sec');
      } else {
        const totalSeconds = Math.floor(diff / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');

        setTimeLeft(`${hours} hrs : ${minutes} min : ${seconds} sec`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [clicked]);

  const handleClick = () => {
    setClicked(true);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleClick}
        className={`group relative px-20 py-6 bg-red-600 hover:bg-red-700 rounded-xl font-semibold text-2xl transition-all duration-500 transform 
          hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50
          ${clicked ? 'rotate-x-animation' : ''}`}
      >
        {/* Glowing effect */}
        <div className="absolute inset-0 rounded-xl bg-red-500 opacity-75 blur-lg animate-pulse group-hover:animate-none group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Button content */}
        <div className="relative flex items-center space-x-4">
          <span>COMING SOON</span>
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"></div>
      </button>

      {clicked && (
        <p className="text-lg font-light text-white-800">
          Countdown : {timeLeft}
        </p>
      )}

      <style jsx>{`
        .rotate-x-animation {
          animation: rotateX 1s ease-out forwards;
        }

        @keyframes rotateX {
          0% {
            transform: rotateX(0deg);
          }
          100% {
            transform: rotateX(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ComingSoonButton;
