import React from "react";
const Hero:React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-[100%] items-center justify-start lg:justify-center p-4">
        <div className="flex min-h-[50vh] lg:min-h-[100vh] flex-col w-[100%] items-center justify-center bg-[url('https://res.cloudinary.com/dhry5xscm/image/upload/v1754333130/moodofnits/election_qz1ri3.webp')] bg-no-repeat bg-center bg-cover rounded-[1rem] md:rounded-[4rem]">
            <div className="flex flex-col items-center justify-center w-[100%] min-h-[50vh] lg:min-h-[100vh] p-9" style={{backgroundImage:"linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))"}}>
                <div className="flex flex-col items-center justify-center w-[100%] h-[100%] lg:items-start">
                    <p className="text-2xl sm:text-4xl lg:text-6xl font-bold text-center lg:text-left lg:w-[40%]">
                        <span style={{fontFamily:"'Great Vibes',cursive",fontWeight:"600",fontStyle:"normal"}}>Exposing the drama of</span><br/><span className="text-[#FF615F]">Campus Politics with Exit Polls</span> & Zero Chill
                    </p>
                </div>
                <div className="text-xl sm:text-2xl lg:text-[1.25rem] flex flex-col gap-4 md:flex-row w-[100%] items-center justify-center md:justify-between p-10">
                    <p className="flex flex-row items-center justify-center gap-4 text-white text-center lg:text-left">
                        <p className="text-sm md:text-xl">GUB Elections 2025 at NIT Silchar</p><div className="beep"></div>
                    </p>
                    <button className="flex flex-row gap-2 items-center justify-center bg-[#313131ef] p-2 md:p-6 rounded-md"><div className="flex flex-col items-center justify-center"><img src="https://res.cloudinary.com/dhry5xscm/image/upload/v1754336369/moodofnits/text-select_dcilsk.svg" alt="exit poll" className="w-[1rem] md:w-[2.5rem] h-[1rem] md:h-[2.5rem]"/></div><p className="text-lg md:text-xl">Exit Polls</p></button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Hero;