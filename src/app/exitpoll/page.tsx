"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const ExitPoll: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState("");

  const targetDate = new Date("2025-08-07T17:00:00+05:30"); // 7 Aug 5PM IST

  useEffect(() => {
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
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-6 text-white relative">
      {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute top-6 left-20"
      >
        <span
          className="flex items-center gap-2 rounded-md bg-blue/60 hover:bg-black/80 px-4 py-2 text-sm font-semibold shadow transition border border-white/50"
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          ← Back to Home
        </span>
      </Link>
      <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-10 shadow-lg backdrop-blur-md">
        <h1 className="mb-4 text-3xl font-bold tracking-wide text-center">
          🗳️ Exit Poll Starts In
        </h1>
        <p className="text-xl font-mono text-[#FF615F] animate-pulse">
          {timeLeft}
        </p>
      </div>
      <style jsx>{`
        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 12px rgba(255, 4, 0, 0.4);
          }
          50% {
            box-shadow: 0 0 24px rgba(255, 4, 0, 0.8);
          }
          100% {
            box-shadow: 0 0 12px rgba(255, 4, 0, 0.4);
          }
        }
      `}</style>
    </div>
  );
};

export default ExitPoll;
