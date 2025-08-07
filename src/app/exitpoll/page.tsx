"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CandidateCard from "~/components/Candidatecard";
import { toast } from "sonner";
import { env } from "~/env";
import axios from "axios";
import type { AxiosError } from "axios";
import { auth } from "~/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { PositionDashboard } from "~/components/PollChart";
import GoogleAuth from "~/components/GoogleAuth";

// --- ALL REQUIRED INTERFACES ---
interface User {
  id: string;
  username: string;
  votes: string;
}

interface CandidateData {
  id: string;
  name: string;
  photo: string;
  designation: keyof typeof positionIndex;
  exitPollId: string;
  votes: string;
}

interface ApiResoponse {
  status: string;
  msg: User;
}

interface CandidateApiResoponse {
  status: string;
  data: CandidateData[];
}

interface ChartCandidate {
  id: string;
  name: string;
  votes: number;
  color: string;
}

interface ChartPosition {
  name: string;
  candidates: ChartCandidate[];
}

// --- CONSTANTS AND TYPES ---
const positionIndex = {
  GS: 0,
  VP: 1,
  GSC: 2,
  GSS: 3,
  GST: 4,
} as const;

type PositionKey = keyof typeof positionIndex;

// --- REACT COMPONENT ---
const ExitPoll: React.FC = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User>();
  const [candidates, setCandidates] = useState<CandidateData[]>([]);

  const getAPI = async () => {
    const token = user ? await user.getIdToken() : null;
    return axios.create({
      baseURL: env.NEXT_PUBLIC_API_URL,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  };

  const fetchUserData = async () => {
    try {
      const API = await getAPI();
      const { data } = await API.get<ApiResoponse>("/user");
      setUserData(data.msg);
    } catch (err) {
      toast.error("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const API = await getAPI();
      const { data } = await API.get<CandidateApiResoponse>("/candidate");
      setCandidates(data.data);
    } catch (error) {
      toast.error("Failed to fetch candidates");
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      await fetchUserData();
      await fetchCandidates();
    };
    void init();
  }, [user]);

  const handleVote = async (
    candidateId: string,
    position: PositionKey
  ) => {
    const idx = positionIndex[position];
    if (!userData || userData.votes[idx] === "1") {
      toast.error(`Already voted for ${position}`);
      return;
    }

    const voteForCandidate = async () => {
      const API = await getAPI();
      await API.post("/vote", { candidateId });

      // 1. Update the user's voting status
      const newVotes = userData.votes.split("");
      newVotes[idx] = "1";
      setUserData({ ...userData, votes: newVotes.join("") });

      // 2. Update local vote counts to reflect the change
      setCandidates(prevCandidates =>
        prevCandidates.map(candidate => {
          if (candidate.id === candidateId) {
            const newVoteCount = (parseInt(candidate.votes, 10) + 1).toString();
            return { ...candidate, votes: newVoteCount };
          }
          return candidate;
        })
      );
    };

    toast.promise(
      voteForCandidate(),
      {
        loading: `Voting for ${position}...`,
        success: `Voted for ${position} successfully!`,
        error: (err: AxiosError<{ msg: string }>) =>
          err.response?.data?.msg ?? "Error voting",
      }
    );
  };



  if (!user) {
   

    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-6 text-white relative">
        <Link href="/" className="absolute top-6 left-4 sm:left-20">
          <span className="flex items-center gap-2 rounded-md bg-blue/60 hover:bg-black/80 px-4 py-2 text-sm font-semibold shadow transition border border-white/50">
            ← Back to Home
          </span>
        </Link>
        
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold font-serif mb-4">Exit Poll 2025</h1>
          <p className="text-xl text-gray-300 mb-8">Please login to participate in the Exit Poll</p>
          
          <div className="flex justify-center">
            <GoogleAuth />
          </div>
        </div>
      </div>
    );
  }

  if (user && loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-white text-4xl font-mono font-bold">
        Loading...
      </div>
    );
  }


  const groupedCandidates: Record<PositionKey, CandidateData[]> = {
    GS: [],
    VP: [],
    GSC: [],
    GSS: [],
    GST: [],
  };

  candidates.forEach((cand) => {
    if (cand.designation in groupedCandidates) {
      groupedCandidates[cand.designation].push(cand);
    }
  });

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-6 text-white relative">
      <Link href="/" className="absolute top-6 left-4 sm:left-20">
        <span className="flex items-center gap-2 rounded-md bg-blue/60 hover:bg-black/80 px-4 py-2 text-sm font-semibold shadow transition border border-white/50">
          ← Back to Home
        </span>
      </Link>

      {Object.entries(groupedCandidates).map(([positionKey, group]) => {
        const position = positionKey as PositionKey;
        const hasVoted = userData?.votes?.[positionIndex[position]] === "1";

        const COLOR_PALETTE = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

        const chartData: ChartPosition = {
          name: position,
          candidates: group.map((cand, idx) => ({
            id: cand.id,
            name: cand.name,
            votes: parseInt(cand.votes, 10) || 0,
            // Add '!' to assert that the value is not undefined
            color: COLOR_PALETTE[idx % COLOR_PALETTE.length]!,
          })),
        };

        return (
          <div key={position} className="w-full my-10 translate-y-10">
            <h2 className="text-4xl font-bold text-center mb-6 font-serif">{position}</h2>

            {group.length > 0 && (
              <div className="mb-10">
                <PositionDashboard position={chartData} userDidVote={hasVoted} />
              </div>
            )}

            <div className="flex flex-row flex-wrap justify-center gap-6">
              {group.map((cand) => (
                <div
                  key={cand.id}
                  className="flex flex-col items-center justify-center"
                >
                  <CandidateCard
                    name={cand.name}
                    position={cand.designation}
                    imageUrl={cand.photo}
                  />
                  <button
                    disabled={hasVoted}
                    onClick={() => handleVote(cand.id, cand.designation)}
                    className={`mt-2 text-white border-2 rounded-full px-6 py-2 duration-200 ${hasVoted
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-black hover:bg-white hover:text-black"
                      }`}
                  >
                    {hasVoted ? "VOTED" : "VOTE"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExitPoll;