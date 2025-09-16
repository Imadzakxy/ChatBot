import React from "react";
import stars from "../assets/stars.png";

export default function Background() {
  return (
    <>
      <div className="absolute top-0 w-full z-[-1] flex flex-col">
        {/* First Background */}
        <div className="h-[100vh] bg-linear-to-t from-[var(--color-1)] to-[var(--color-2)] z-[-1]">
          <div className="absolute top-0 left-0 w-screen h-[60vh] overflow-hidden">
            <img
              className="absolute w-full h-[100vh] object-cover animate-[scrollStars_40s_linear_infinite] blur-[2px]"
              src={stars}
              alt="Stars"
            />
            <img
              className="absolute w-full h-[100vh] object-cover top-[-100vh] animate-[scrollStars_40s_linear_infinite] blur-[2px]"
              src={stars}
              alt="Stars"
            />
            <div
              className="absolute bottom-0 w-full h-20 pointer-events-none"
              style={{
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0% ,black 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0% ,black 100%)",
              }}
            />
          </div>
        </div>
        {/* Second Background */}

        <div className="h-[100vh] bg-linear-to-t from-[var(--color-1)] to-[var(--color-2)] z-[-1] rotate-180 ">
          <div className="absolute left-0 w-screen h-[60vh] overflow-hidden">
            <img
              className="absolute w-full h-[100vh] object-cover animate-[scrollStars_40s_linear_infinite] blur-[2px]"
              src={stars}
              alt="Stars"
            />
            <img
              className="absolute w-full h-[100vh] object-cover top-[-100vh] animate-[scrollStars_40s_linear_infinite] blur-[2px]"
              src={stars}
              alt="Stars"
            />
            <div
              className="absolute bottom-0 w-full h-20 pointer-events-none"
              style={{
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",

                /* MASQUE dégradé vers le bas */
                maskImage:
                  "linear-gradient(to bottom, transparent 0% ,black 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0% ,black 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}