import React from "react";
import CandidateCard from "../../components/Candidatecard";

const CandidatesPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-black px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Candidates for GST</h1>
      {/* CandidateCard Section */}
      <div className="mt-6 flex flex-row items-center gap-8">
        <CandidateCard
          name="Tamaghna Kr Bora"
          position="General Secretary (Technical)"
          imageUrl="https://res.cloudinary.com/dz2mlxltd/image/upload/v1754503162/Screenshot_2025-08-06_232903_yzbqqp.png"
        />
        <CandidateCard
          name="Sahin Alam"
          position="General Secretary (Technical)"
          imageUrl="https://res.cloudinary.com/dz2mlxltd/image/upload/v1754503801/Screenshot_2025-08-06_233942_y6yxzh.png"
        />
      </div>
    </div>
  );
};

export default CandidatesPage;