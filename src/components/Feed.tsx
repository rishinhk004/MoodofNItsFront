import React from "react";
import Card from "./Card";
const Feed: React.FC = () => {
  return (
    <div id="feed" className="flex flex-col min-h-screen items-center justify-start px-4 sm:px-6 lg:px-8">
        <h1 className="text-[#ffffff]">YOUR FEED</h1>
        <div className="flex flex-wrap gap-4 w-full">
          <Card/>
        </div>
    </div>
  );
};

export default Feed;
