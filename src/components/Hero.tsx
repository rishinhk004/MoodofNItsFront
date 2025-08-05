import React from "react";
const Hero: React.FC = () => {
  return (
    <div className="flex min-h-screen w-[100%] flex-col items-center justify-start p-4 lg:justify-center">
      <div className="flex min-h-[50vh] w-[100%] flex-col items-center justify-center rounded-[1rem] bg-[url('https://res.cloudinary.com/dhry5xscm/image/upload/v1754333130/moodofnits/election_qz1ri3.webp')] bg-cover bg-center bg-no-repeat md:rounded-[4rem] lg:min-h-[100vh]">
        <div
          className="flex min-h-[50vh] w-[100%] flex-col items-center justify-center p-9 lg:min-h-[100vh]"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
          }}
        >
          <div className="flex h-[100%] w-[100%] flex-col items-center justify-center lg:items-start">
            <p className="text-center text-2xl font-bold sm:text-4xl lg:w-[40%] lg:text-left lg:text-6xl">
              <span
                style={{
                  fontFamily: "'Great Vibes',cursive",
                  fontWeight: "600",
                  fontStyle: "normal",
                }}
              >
                Exposing the drama of
              </span>
              <br />
              <span className="text-[#FF615F]">
                Campus Politics with Exit Polls
              </span>{" "}
              & Zero Chill
            </p>
          </div>
          <div className="flex w-[100%] flex-col items-center justify-center gap-4 p-10 text-xl sm:text-2xl md:flex-row md:justify-between lg:text-[1.25rem]">
            <p className="flex flex-row items-center justify-center gap-4 text-center text-white lg:text-left">
              <p className="text-sm md:text-xl">
                GUB Elections 2025 at NIT Silchar
              </p>
              <div className="beep"></div>
            </p>
            <button className="flex flex-row items-center justify-center gap-2 rounded-md bg-[#313131ef] p-2 md:p-6">
              <div className="flex flex-col items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dhry5xscm/image/upload/v1754336369/moodofnits/text-select_dcilsk.svg"
                  alt="exit poll"
                  className="h-[1rem] w-[1rem] md:h-[2.5rem] md:w-[2.5rem]"
                />
              </div>
              <p className="text-lg md:text-xl">Exit Polls</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
