"use client";
import React, { useState, useEffect } from "react";

const ComingSoonButton: React.FC = () => {
  const [clicked, setClicked] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // Target time: 5th August 4:00 PM IST
  const targetDate = new Date("2025-08-05T16:00:00+05:30");

  useEffect(() => {
    if (!clicked) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft("00 hrs : 00 min : 00 sec");
      } else {
        const totalSeconds = Math.floor(diff / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");

        setTimeLeft(`${hours} hrs : ${minutes} min : ${seconds} sec`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [clicked]);

  const handleClick = () => {
    setClicked(true);
  };

  return (
    <div className="flex flex-col items-center space-y-6 scale-75 sm:scale-100">
      <button
        onClick={handleClick}
        className={`group relative transform rounded-xl bg-red-600 px-20 py-6 text-2xl font-semibold transition-all duration-500 hover:scale-105 
          hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/50
          ${clicked ? "rotate-x-animation" : ""}`}
      >
        {/* Glowing effect */}
        <div className="absolute inset-0 animate-pulse rounded-xl bg-red-500 opacity-75 blur-lg transition-opacity duration-300 group-hover:animate-none group-hover:opacity-100"></div>

        {/* Button content */}
        <div className="relative flex items-center space-x-4">
          <span>COMING SOON</span>
        </div>

        {/* Shimmer effect */}
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"></div>
      </button>

      {clicked && (
        <>
          <p className="text-white text-center text-sm font-light fade-in-up delay-[200ms]">
            Publication of Provisional Nomination List:
            <br />
            {timeLeft}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 px-4 mt-4">
  <div className="feature-card animation-delay-300 max-w-xs text-center">
    <h3 className="text-lg font-semibold mb-2">🎭 MemeFeed is Coming!</h3>
    <p className="text-sm">
      Got memes, rants, or random tea ? <br />
      Post away and see what clicks! <br />
      Let the chaos (and laughs) begin.
    </p>
  </div>

  <div className="feature-card animation-delay-500 max-w-xs text-center">
    <h3 className="text-lg font-semibold mb-2">🗳️ What's the Mood?</h3>
    <p className="text-sm">
      Exit polls are going live! <br />
      Make your own prediction. <br />
      Who has got the the best instincts?
    </p>
  </div>
</div>

        </>
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

        .feature-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          padding: 1.5rem;
          width: 18rem;
          color: white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ComingSoonButton;
