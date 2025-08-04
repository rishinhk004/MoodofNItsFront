import React from "react";
import Card from "./Card";
const Feed: React.FC = () => {
  return (
    <div id="feed" className="flex flex-wrap min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card/>
    </div>
  );
};

export default Feed;
