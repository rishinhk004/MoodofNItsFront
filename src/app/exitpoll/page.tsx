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
}

interface ApiResoponse {
  status: string;
  msg: User;
}

interface CandidateApiResoponse {
  status: string;
  data: CandidateData[];
}

const positionIndex = {
  GS: 0,
  VP: 1,
  GSC: 2,
  GSS: 3,
  GST: 4,
} as const;

type PositionKey = keyof typeof positionIndex;

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

    try {
      const API = await getAPI();
      const res = await API.post("/vote", {
        candidateId,
      });

      if (res.status === 200) {
        const newVotes = userData.votes.split("");
        newVotes[idx] = "1";
        setUserData({ ...userData, votes: newVotes.join("") });
        toast.success(`Voted for ${position} successfully!`);
      }
    } catch (err) {
      const error = err as AxiosError<{ msg: string }>;
      toast.error(error.response?.data?.msg ?? "Error voting");
    }
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-white">
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
    groupedCandidates[cand.designation].push(cand);
  });

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-6 text-white relative">
      <Link href="/" className="absolute top-6 left-20">
        <span className="flex items-center gap-2 rounded-md bg-blue/60 hover:bg-black/80 px-4 py-2 text-sm font-semibold shadow transition border border-white/50">
          ← Back to Home
        </span>
      </Link>

      {Object.entries(groupedCandidates).map(([positionKey, group]) => {
        const position = positionKey as PositionKey;
        const index = positionIndex[position];
        const hasVoted = userData?.votes?.[index] === "1";

        return (
          <div key={position} className="w-full my-10">
            <h2 className="text-3xl font-bold text-center mb-4">{position}</h2>
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
                    className={`mt-2 text-white border-2 rounded-full px-6 py-2 duration-200 ${
                      hasVoted
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
