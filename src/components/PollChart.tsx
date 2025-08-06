"use client";

import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  
} from "chart.js";

import type { ChartOptions } from "chart.js";

import { Award, ShieldCheck, ShieldAlert } from "lucide-react";
import { CardHeader, CardContent, CardDescription, CardTitle } from "./ui/card";

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, BarElement, Title);

const POSITION_MAP: Record<string, number> = {
  GS: 0,
  VP: 1,
  GSC: 2,
  GSS: 3,
  GST: 4,
};

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
  userVotes?: string;
}

export const PositionDashboard = ({ position, userVotes }: PositionDashboardProps) => {
  const sortedCandidates = useMemo(() => [...position.candidates].sort((a, b) => b.votes - a.votes), [position.candidates]);
  const posIndex = POSITION_MAP[position.name];
  const hasVoted = userVotes && posIndex !== undefined && userVotes[posIndex] === "1";

  const pieData = {
    labels: sortedCandidates.map((c) => c.name),
    datasets: [
      {
        data: sortedCandidates.map((c) => c.votes),
        backgroundColor: sortedCandidates.map((c) => c.color),
        borderWidth: 1,
      },
    ],
  };

  const pieOptions: ChartOptions<'pie'> = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: { label: string; parsed: { r: number } }) => {
            const label = ctx.label || "";
            const value = ctx.parsed || 0;
            return `${label}: ${value.toLocaleString()} votes`;
          },
        },
      },
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#ccc",
          font: { size: 12 },
        },
      },
    },
  };

  

  return (
    <div
      className={`m-4 flex max-w-6xl flex-col rounded-2xl border border-gray-700 bg-[#1c1c1e] text-white shadow-md transition hover:shadow-lg`}
    >
      <CardHeader className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center text-2xl">
              <Award className="mr-3 h-6 w-6 text-primary" />
              Position: {position.name}
            </CardTitle>
            <CardDescription className="text-gray-400">Live vote count for all candidates.</CardDescription>
          </div>
          {userVotes && (hasVoted ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
              <ShieldCheck className="h-4 w-4" />
              Voted
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-semibold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
              <ShieldAlert className="h-4 w-4" />
              Vote pending
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 min-w-[220px] max-w-[400px] w-full h-[250px] flex items-center justify-center">
                <Pie data={pieData} options={pieOptions} />
            </div>
        </div>
      </CardContent>
    </div>
  );
};
// "use client";

// import React, { useMemo } from "react";
// import { Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip as ChartTooltip,
//   Legend as ChartLegend,
//   Title,
// } from "chart.js";

// import { Award, ShieldCheck, ShieldAlert } from "lucide-react";
// import { CardHeader, CardContent, CardDescription, CardTitle } from "./ui/card";

// // Register Chart.js components
// ChartJS.register(ArcElement, ChartTooltip, ChartLegend, Title);

// const POSITION_MAP: Record<string, number> = {
//   GS: 0,
//   VP: 1,
//   GSC: 2,
//   GSS: 3,
//   GST: 4,
// };

// interface Candidate {
//   id: string;
//   name: string;
//   votes: number;
//   color: string;
// }

// interface Position {
//   name: string;
//   candidates: Candidate[];
// }

// interface PositionDashboardProps {
//   position: Position;
//   userVotes?: string;
// }

// export const PositionDashboard = ({ position, userVotes }: PositionDashboardProps) => {
//   const sortedCandidates = useMemo(() => [...position.candidates].sort((a, b) => b.votes - a.votes), [position.candidates]);
  
//   // --- NEW: Calculate Total Votes, Lead Margin, and Leader ---
//   const { totalVotes, leadMargin, leader } = useMemo(() => {
//     const total = position.candidates.reduce((sum, c) => sum + c.votes, 0);

//     if (sortedCandidates.length === 0) {
//       return { totalVotes: 0, leadMargin: 0, leader: null };
//     }

//     const currentLeader = sortedCandidates[0];
//     const runnerUp = sortedCandidates[1];
    
//     // Margin is the difference with the runner-up, or total votes if only one candidate
//     const margin = runnerUp ? currentLeader.votes - runnerUp.votes : currentLeader.votes;

//     return { totalVotes: total, leadMargin: margin, leader: currentLeader };
//   }, [position.candidates, sortedCandidates]);


//   const posIndex = POSITION_MAP[position.name];
//   const hasVoted = userVotes && posIndex !== undefined && userVotes[posIndex] === "1";

//   const pieData = {
//     labels: sortedCandidates.map((c) => c.name),
//     datasets: [
//       {
//         data: sortedCandidates.map((c) => c.votes),
//         backgroundColor: sortedCandidates.map((c) => c.color),
//         borderWidth: 1,
//       },
//     ],
//   };

//   const pieOptions = {
//     plugins: {
//       tooltip: {
//         callbacks: {
//           label: (ctx: { label: string; parsed: number }) => {
//             const label = ctx.label || "";
//             const value = ctx.parsed || 0;
//             const percentage = totalVotes > 0 ? ((value / totalVotes) * 100).toFixed(1) : 0;
//             return `${label}: ${value.toLocaleString()} votes (${percentage}%)`;
//           },
//         },
//       },
//       legend: {
//         position: "bottom" as const,
//         labels: {
//           color: "#ccc",
//           font: { size: 12 },
//         },
//       },
//     },
//   };

//   return (
//     <div
//       className={`m-4 flex max-w-6xl flex-col rounded-2xl border border-gray-700 bg-[#1c1c1e] text-white shadow-md transition hover:shadow-lg`}
//     >
//       <CardHeader className="p-6">
//         <div className="flex justify-between items-start">
//           <div>
//             <CardTitle className="flex items-center text-2xl">
//               <Award className="mr-3 h-6 w-6 text-primary" />
//               Position: {position.name}
//             </CardTitle>
//             <CardDescription className="text-gray-400 mt-1">Live vote count for all candidates.</CardDescription>

//             {/* --- NEW: Displaying Total Votes & Lead Margin --- */}
//             <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
//               <div>
//                 <span className="text-gray-400">Total Votes: </span>
//                 <span className="font-bold text-white">{totalVotes.toLocaleString()}</span>
//               </div>
//               {sortedCandidates.length > 1 && (
//                  <div>
//                    <span className="text-gray-400">Lead Margin: </span>
//                    <span className="font-bold text-white">{leadMargin.toLocaleString()} votes</span>
//                  </div>
//               )}
//             </div>
//           </div>
//           {userVotes && (hasVoted ? (
//             <div className="flex items-center gap-2 text-sm font-semibold text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
//               <ShieldCheck className="h-4 w-4" />
//               Voted
//             </div>
//           ) : (
//             <div className="flex items-center gap-2 text-sm font-semibold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
//               <ShieldAlert className="h-4 w-4" />
//               Vote pending
//             </div>
//           ))}
//         </div>
//       </CardHeader>
//       <CardContent className="p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
//           <div className="lg:col-span-2 h-[250px]">
//             <Pie data={pieData} options={pieOptions} />
//           </div>
//           {/* --- REVISED: Display candidates with bars and exact percentages --- */}
//           <div className="lg:col-span-3">
//             <div className="space-y-4">
//               {sortedCandidates.map((candidate) => {
//                 const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
//                 const barWidth = leader && leader.votes > 0 ? (candidate.votes / leader.votes) * 100 : 0;

//                 return (
//                   <div key={candidate.id}>
//                     <div className="flex justify-between items-center mb-1.5">
//                       <p className="text-sm font-medium text-gray-200">{candidate.name}</p>
//                       <p className="text-sm font-semibold text-white">
//                         {candidate.votes.toLocaleString()}
//                         <span className="ml-2 text-gray-400 font-normal">({percentage.toFixed(1)}%)</span>
//                       </p>
//                     </div>
//                     <div className="w-full bg-gray-600/50 rounded-full h-3">
//                        <div
//                          className="h-3 rounded-full"
//                          style={{
//                            width: `${barWidth}%`,
//                            backgroundColor: candidate.color,
//                            transition: 'width 0.5s ease-in-out'
//                          }}
//                        ></div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </div>
//   );
// };