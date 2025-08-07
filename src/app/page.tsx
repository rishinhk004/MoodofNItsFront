import React from "react";

import Feed from "../components/Feed";
import Hero from "~/components/Hero";

const MainContent: React.FC = () => {
  return (
    <main className="flex min-h-screen w-[100%] flex-col items-center justify-start py-4 sm:px-6 lg:px-8 overflow-hidden">
  <Hero />

  

  <div className="mt-8 w-full">
    <Feed />
  </div>
</main>
  );
};

export default MainContent;
