"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CandidateCard from "~/components/Candidatecard";
import { PositionDashboard } from "~/components/PollChart";
interface CardExitPollProps {
  candidateId?: string;
  photoUrl: string;
  name: string;
  description: string;
}

// Add these dummy data structures
const dummyPositions = {
  GS: {
    name: "GS",
    candidates: [
      { id: "1", name: "Candidate 1", votes: 150, color: "#FF6B6B" },
      { id: "2", name: "Candidate 2", votes: 120, color: "#4ECDC4" },
    ]
  },
  VP: {
    name: "VP",
    candidates: [
      { id: "3", name: "Candidate 3", votes: 180, color: "#45B7D1" },
      { id: "4", name: "Candidate 4", votes: 90, color: "#96CEB4" },
    ]
  },
  GSC: {
    name: "GSC",
    candidates: [
      { id: "5", name: "Candidate 5", votes: 200, color: "#D4A5A5" },
      { id: "6", name: "Candidate 6", votes: 160, color: "#9B5DE5" },
    ]
  },
  GST: {
    name: "GST",
    candidates: [
      { id: "7", name: "Candidate 7", votes: 140, color: "#FFB5E8" },
      { id: "8", name: "Candidate 8", votes: 130, color: "#B8E1FF" },
    ]
  },
  GSS: {
    name: "GSS",
    candidates: [
      { id: "9", name: "Candidate 9", votes: 170, color: "#FED1EF" },
      { id: "10", name: "Candidate 10", votes: 110, color: "#C5A3FF" },
    ]
  }
};

// Dummy user votes string (1 means voted, 0 means not voted)
const dummyUserVotes = "10110"; // Example: voted for GS, GSC, GST

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
      {/* <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-10 shadow-lg backdrop-blur-md">
        <h1 className="mb-4 text-3xl font-bold tracking-wide text-center">
          🗳️ Exit Poll Starts In
        </h1>
        <p className="text-xl font-mono text-[#FF615F] animate-pulse">
          {timeLeft}
        </p>
      </div> */}
      <div className="flex flex-col items-center w-[100%] text-[#ffffff] justify-center gap-24">
        <div className="flex flex-col items-center justify-center m-6">
          <h1>
            General Secretary Gymkhana
          </h1>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <CandidateCard name="Samarjit" position="GST" imageUrl="https://res.cloudinary.com/dhry5xscm/image/upload/v1754333130/moodofnits/election_qz1ri3.webp" />
              <button className="text-[#ffffff] bg-[#000000] hover:bg-[#ffffff] hover:text-[#000000] duration-200 border-2 rounded-full px-20 py-2">VOTE</button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <CandidateCard name="Samarjit" position="GST" imageUrl="https://res.cloudinary.com/dhry5xscm/image/upload/v1754333130/moodofnits/election_qz1ri3.webp" />
              <button className="text-[#ffffff] bg-[#000000] hover:bg-[#ffffff] hover:text-[#000000] duration-200 border-2 rounded-full px-20 py-2">VOTE</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1>
            Vice President
          </h1>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <CandidateCard name="Samarjit" position="GST" imageUrl="https://res.cloudinary.com/dhry5xscm/image/upload/v1754333130/moodofnits/election_qz1ri3.webp" />
              <button className="text-[#ffffff] bg-[#000000] hover:bg-[#ffffff] hover:text-[#000000] duration-200 border-2 rounded-full px-20 py-2">VOTE</button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <CandidateCard name="Samarjit" position="GST" imageUrl="https://res.cloudinary.com/dhry5xscm/image/upload/v1754333130/moodofnits/election_qz1ri3.webp" />
              <button className="text-[#ffffff] bg-[#000000] hover:bg-[#ffffff] hover:text-[#000000] duration-200 border-2 rounded-full px-20 py-2">VOTE</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1>
            General Secretary Cultural
          </h1>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <CandidateCard name="Samarjit" position="GST" imageUrl="https://res.cloudinary.com/dhry5xscm/image/upload/v1754333130/moodofnits/election_qz1ri3.webp" />
              <button className="text-[#ffffff] bg-[#000000] hover:bg-[#ffffff] hover:text-[#000000] duration-200 border-2 rounded-full px-20 py-2">VOTE</button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <CandidateCard name="Samarjit" position="GST" imageUrl="https://res.cloudinary.com/dhry5xscm/image/upload/v1754333130/moodofnits/election_qz1ri3.webp" />
              <button className="text-[#ffffff] bg-[#000000] hover:bg-[#ffffff] hover:text-[#000000] duration-200 border-2 rounded-full px-20 py-2">VOTE</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1>
            General Secretary Technical
          </h1>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <CandidateCard name="Samarjit" position="GST" imageUrl="https://res.cloudinary.com/dhry5xscm/image/upload/v1754333130/moodofnits/election_qz1ri3.webp" />
              <button className="text-[#ffffff] bg-[#000000] hover:bg-[#ffffff] hover:text-[#000000] duration-200 border-2 rounded-full px-20 py-2">VOTE</button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <CandidateCard name="Samarjit" position="GST" imageUrl="https://res.cloudinary.com/dhry5xscm/image/upload/v1754333130/moodofnits/election_qz1ri3.webp" />
              <button className="text-[#ffffff] bg-[#000000] hover:bg-[#ffffff] hover:text-[#000000] duration-200 border-2 rounded-full px-20 py-2">VOTE</button>
            </div>
            <PositionDashboard 
          position={dummyPositions.GS} 
          userVotes={dummyUserVotes}
        />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1>
            General Secretary Sports
          </h1>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <CandidateCard name="Samarjit" position="GST" imageUrl="https://res.cloudinary.com/dhry5xscm/image/upload/v1754333130/moodofnits/election_qz1ri3.webp" />
              <button className="text-[#ffffff] bg-[#000000] hover:bg-[#ffffff] hover:text-[#000000] duration-200 border-2 rounded-full px-20 py-2">VOTE</button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <CandidateCard name="Samarjit" position="GST" imageUrl="https://res.cloudinary.com/dhry5xscm/image/upload/v1754333130/moodofnits/election_qz1ri3.webp" />
              <button className="text-[#ffffff] bg-[#000000] hover:bg-[#ffffff] hover:text-[#000000] duration-200 border-2 rounded-full px-20 py-2">VOTE</button>
            </div>
          </div>
             <PositionDashboard 
          position={dummyPositions.GS} 
          userVotes={dummyUserVotes}
        />
        </div>
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
