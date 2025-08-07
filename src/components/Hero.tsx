import React from "react";
import Link from "next/link";
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <div className="flex w-[100%] flex-col items-center justify-start p-4 lg:justify-center">
      <div className="flex min-h-[10vh] w-[100%] flex-col items-center justify-center rounded-[1rem] bg-[url('https://res.cloudinary.com/dz2mlxltd/image/upload/c_crop,w_1080,h_600/v1754403210/gettyimages-1203055296-24bf09b7f849da81487a88f214d6c4188632dbd3_bdapv3.jpg')] bg-cover bg-center bg-no-repeat md:rounded-[4rem] lg:min-h-[80vh]">
        <div
          className="flex min-h-[50vh] w-[100%] flex-col items-center justify-center p-9 lg:min-h-[100vh]"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(0, 0, 0, 1) 8%, rgba(0, 0, 0, 0.17) 90%)",
          }}
        >
          <div className="flex h-[100%] w-[100%] flex-col items-center justify-center lg:items-start">
            {/* Black gradient background for heading and GUB Elections */}
            <div
              className="w-full lg:w-[40%] rounded-xl p-6"
              style={{
                background: "linear-gradient(90deg, rgba(0,0,0,0.95) 80%, rgba(0,0,0,0.6) 100%)",
                boxShadow: "0 4px 24px 0 rgba(0,0,0,0.25)",
              }}
            >
              <p className="text-left text-2xl font-bold sm:text-4xl lg:text-6xl text-white">
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
              <div className="flex flex-row items-center gap-3 text-white text-left mt-4">
                <p className="text-xl md:text-xl font-normal">
                  GUB Elections 2025 at NIT Silchar
                </p>
                <div className="relative">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping shadow-lg shadow-red-500/50"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                </div>
              </div>

            </div>
          </div>
          {/* Exit Polls button remains as it was */}
          <div className="flex w-[100%] flex-col items-center justify-center gap-2 p-1 text-xl sm:text-2xl md:flex-row md:justify-between lg:text-[1.25rem]">
            <Link href="/exitpoll">
              <button className="flex flex-row items-center justify-center gap-2 rounded-md bg-black p-1 md:p-4">
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src="https://res.cloudinary.com/dz2mlxltd/image/upload/v1754401039/Screenshot_2025-08-05_190704_mjqo14.png"
                    alt="exit poll"
                    width={24}
                    height={24}
                    className="h-[1rem] w-[1rem] md:h-[1.5rem] md:w-[1.5rem]"
                  />
                </div>
                <p className="text-lg md:text-xl font-serif"> Click to Enter Exit Polls</p>
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
