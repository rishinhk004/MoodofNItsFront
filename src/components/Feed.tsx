import React from "react";
import Card from "./Card";

const Feed: React.FC = () => {
  return (
    <div
      id="feed"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 px-8 py-12 min-h-screen"
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <Card key={index} />
      ))}
    </div>
  );
};

export default Feed;
