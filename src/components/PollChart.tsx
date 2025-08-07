

"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Award, ShieldCheck, ShieldAlert } from "lucide-react";
import { CardHeader, CardContent, CardDescription, CardTitle } from "./ui/card"; // Assuming you have these UI components
import type  { TooltipProps } from 'recharts';


interface Candidate {
  id: string;
  name: string;
  votes: number;
  color: string;
}

interface Position {
  name: string;
  candidates: Candidate[];
}

interface PositionDashboardProps {
  position: Position;
  userDidVote?: boolean;
}

interface Data{
    votes: number;
}

interface CustomPayload {
  name: string;
  votes: number;
  payload: Data 
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  totalVotes: number;
  payload?: CustomPayload[];
}

const CustomTooltip = (props: CustomTooltipProps) => {
  const { active, payload, totalVotes } = props;

  if (active && payload?.length) {
    const data = payload[0]!.payload as CustomPayload;
    const percentage =
      totalVotes > 0 ? ((data.votes / totalVotes) * 100).toFixed(1) : '0';

    return (
      <div className="p-2 border rounded-md bg-[#2a2a2c] text-white border-gray-600">
        <p className="font-semibold">{data.name}</p>
        <p>(${percentage}%)`</p>
      </div>
    );
  }

  return null;
};

export const PositionDashboard = ({ position, userDidVote }: PositionDashboardProps) => {
  const { sortedCandidates, totalVotes } = useMemo(() => {
    const candidates = [...position.candidates];
    const sorted = candidates.sort((a, b) => b.votes - a.votes);
    const total = sorted.reduce((sum, c) => sum + c.votes, 0);
    return {
      sortedCandidates: sorted,
      totalVotes: total,
    };
  }, [position.candidates]);


  return (
    <div className="m-4 flex max-w-lg mx-auto flex-col rounded-2xl border border-gray-700 bg-[#1c1c1e] text-white shadow-lg">
      <CardHeader className="p-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <CardTitle className="flex items-center text-2xl font-bold">
              <Award className="mr-3 h-7 w-7 text-yellow-400" />
              {position.name}
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2">
              Total Votes:{" "}
              <span className="font-bold text-white">{totalVotes.toLocaleString()}</span>
            </CardDescription>
          </div>
          {typeof userDidVote !== 'undefined' && (
            <div
              className={`flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full ${
                userDidVote
                  ? "bg-green-400/10 text-green-400"
                  : "bg-yellow-400/10 text-yellow-400"
              }`}
            >
              {userDidVote ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <ShieldAlert className="h-4 w-4" />
              )}
              {userDidVote ? "Voted" : "Vote Pending"}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 flex justify-center items-center">
        {/* 3. Recharts Pie Chart Implementation */}
        <div className="h-[300px] w-full max-w-sm">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip totalVotes={totalVotes} />} />
              <Legend verticalAlign="bottom" height={36} />
              <Pie
                data={sortedCandidates}
                dataKey="votes"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                paddingAngle={2}
              >
                {sortedCandidates.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </div>
  );
};