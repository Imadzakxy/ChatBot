import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import rocket from "../assets/rocket.png";
import Marquee from "react-fast-marquee";
import HomeBackground from "../components/HomeBackground";

export default function Home() {
  const text = `one chat away from building a dream! ...`;
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const goToChatPage = () => {
    navigate("/chatpage");
  };

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <HomeBackground />

      <section className="h-screen w-full flex flex-col justify-center items-center px-4 md:px-20">
        <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-6xl gap-8 mb-30">
          <motion.div
            className="text-2xl sm:text-3xl lg:text-5xl text-white font-main max-w-lg text-center lg:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {displayedText.split(" ").map((word, i) => (
              <span
                key={i}
                className={
                  word === "dream!" || word === "..."
                    ? "text-[var(--color-1)]"
                    : ""
                }
              >
                {word}{" "}
              </span>
            ))}
            <motion.span
              className="text-[var(--color-1)]"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              |
            </motion.span>
          </motion.div>

          <motion.img
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-48 sm:w-64 lg:w-80 float"
            src={rocket}
            alt="rocket"
          />
        </div>
      </section>

      <section className="w-full flex flex-col justify-center items-center px-4 md:px-20 gap-10">
        <div className="flex flex-col justify-center items-center text-center">
          <div className="font-main text-[var(--color-2)] text-2xl sm:text-3xl">
            Start Innovating
          </div>
          <div className="font-secondary font-bold text-2xl sm:text-3xl text-white mt-4">
            Now !!
          </div>

          <button
            className="bg-[var(--color-1)] px-5 py-3 text-lg sm:text-xl mt-10 rounded-4xl text-white font-bold hover:bg-[var(--color-2)] transition-all duration-500"
            onClick={goToChatPage}
          >
            Click To Chat
          </button>
        </div>

        <div className="w-screen">
          <Marquee pauseOnHover={true} speed={40}>
            {/* Tweet Block 1 */}
            <div className="mx-4 w-64 sm:w-80 md:w-96 rotate-2 hover:rotate-0 transition-all duration-500">
              <blockquote className="twitter-tweet">
                <p lang="en" dir="ltr">
                  i liked how this AI helps you build your startup{" "}
                  <a href="https://twitter.com/startupgenie25?ref_src=twsrc%5Etfw">
                    @startupgenie25
                  </a>
                </p>
                — idrismekbal (@idrismekbal){" "}
                <a href="https://twitter.com/idrismekbal/status/1900956305143071049?ref_src=twsrc%5Etfw">
                  March 15, 2025
                </a>
              </blockquote>
            </div>

            {/* Tweet Block 2 */}
            <div className="mx-4 w-64 sm:w-80 md:w-96 rotate-[-2deg] hover:rotate-0 transition-all duration-500">
              <blockquote className="twitter-tweet">
                <p lang="en" dir="ltr">
                  if you're looking to innovate your startup i suggest you use
                  this amazing AI{" "}
                  <a href="https://twitter.com/startupgenie25?ref_src=twsrc%5Etfw">
                    @startupgenie25
                  </a>
                </p>
                — hmd😎 (@Da_ahmed_){" "}
                <a href="https://twitter.com/Da_ahmed_/status/1901012147930312792?ref_src=twsrc%5Etfw">
                  March 15, 2025
                </a>
              </blockquote>
            </div>

            {/* Tweet Block 3 */}
            <div className="mx-4 w-64 sm:w-80 md:w-96 rotate-2 hover:rotate-0 transition-all duration-500">
              <blockquote className="twitter-tweet">
                <p lang="en" dir="ltr">
                  Another super AI tool to improve your startup{" "}
                  <a href="https://twitter.com/startupgenie25?ref_src=twsrc%5Etfw">
                    @startupgenie25
                  </a>
                </p>
                — Imad Naitmihoub (@naitmihoub){" "}
                <a href="https://twitter.com/naitmihoub/status/1901029306513715679?ref_src=twsrc%5Etfw">
                  March 15, 2025
                </a>
              </blockquote>
            </div>
          </Marquee>
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            charSet="utf-8"
          ></script>
        </div>
      </section>
    </div>
  );
}