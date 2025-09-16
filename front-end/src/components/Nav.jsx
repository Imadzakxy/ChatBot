import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import SideBar from "./sideBar";
import ProfileBar from "./profileBar";
import ProfileIcon from "./ProfileIcon";
import MenuIcon from "./MenuIcon";
import { Link } from "react-router-dom";

export default function Nav() {
  const [displaySideBar, setDisplaySideBar] = useState(false);
  const [displayProfileList, setDisplayProfileList] = useState(false);

  const toggleSideBar = () => {
    setDisplaySideBar(!displaySideBar);
    if (!displaySideBar) setDisplayProfileList(false);
  };
  const toggleProfileBar = () => {
    setDisplayProfileList(!displayProfileList);
    if (!displayProfileList) setDisplaySideBar(false);
  };

  return (
    <motion.nav
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <SideBar
        displaySideBar={displaySideBar}
        setDisplaySideBar={setDisplaySideBar}
        setDisplayProfileList={setDisplayProfileList}
      />
      <ProfileBar
        displayProfileList={displayProfileList}
        setDisplayProfileList={setDisplayProfileList}
        setDisplaySideBar={setDisplaySideBar}
      />

      <header className="flex flex-row lg:px-20 px-3 pt-2 justify-between items-center">
        <MenuIcon
          color={"var(--color-3)"}
          size={60}
          onClick={() => {
            toggleSideBar();
          }}
        />
        <Link
          to="/"
          className="sm:text-4xl text-xl font-main text-[var(--color-3)] drop-shadow-lg hover:cursor-pointer"
        >
          StartupGenie
        </Link>
        <ProfileIcon
          size={50}
          color={"var(--color-3)"}
          onClick={() => {
            toggleProfileBar();
          }}
        />
      </header>
    </motion.nav>
  );
}