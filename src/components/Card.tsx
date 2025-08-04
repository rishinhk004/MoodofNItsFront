import React from "react";

const Card: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:px-6 lg:px-8 border-[1px] border-gray-500 rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center">
            <img src="https://preview.redd.it/modi-jee-ka-diet-plan-milega-kya-v0-tr0kc46nbjgf1.jpeg?width=1080&crop=smart&auto=webp&s=6d7e78e49771ec8c683d79a19332b99c9e30452e" className="w-[100%]" alt="image loading.."/>
        </div>
        <div className="flex flex-row items-center justify-center"></div>
    </div>
  );
};

export default Card;
