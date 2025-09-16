import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "./ThemeContext";
import { useState } from "react";
import { useChat } from "./ChatContext";

const SideBar = ({ displaySideBar, setDisplaySideBar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, changeTheme, availableThemes } = useTheme();
  const [showThemes, setShowThemes] = useState(false);
  const { chatHistory, updateChatHistory } = useChat();

  const handleNewChat = () => {
    // Create a new chat with empty messages
    const newChat = {
      id: Date.now(),
      messages: [],
      date: new Date().toISOString()
    };
    updateChatHistory(newChat);
    navigate('/chatPage', { replace: true });
    setDisplaySideBar(false);
  };

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`, { replace: true }); // Fixed navigation
    setDisplaySideBar(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <>
      <AnimatePresence>
        {displaySideBar && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeIn" }}
            className="z-10 fixed bg-[var(--color-1)] top-2 left-2 w-3xs text-[var(--color-3)] pb-3 transition-transform transform translate-x-0 rounded-lg shadow-lg"
          >
            <div className="flex justify-end p-3">
              <button
                onClick={() => setDisplaySideBar(false)}
                className="text-2xl hover:text-red-500"
              >
                <i className="bx bx-x"></i>
              </button>
            </div>
            <ul>
              <Link
                to="/"
                className={`${
                  location.pathname === "/" && "text-[var(--color-2)]"
                }`}
              >
                <li className="px-4 mb-2 p-2 font-bold pointer-events-auto cursor-pointer hover:bg-[var(--color-3)] hover:text-[var(--color-2)]">
                  Home
                </li>
              </Link>

              <li 
                onClick={handleNewChat}
                className="px-4 mb-2 p-2 font-bold pointer-events-auto cursor-pointer hover:bg-[var(--color-3)] hover:text-[var(--color-2)]"
              >
                New Chat
              </li>

              <div className="px-4 mb-2">
                <h3 className="font-bold mb-2">Chat History</h3>
                <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                  {chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleChatClick(chat.id)}
                      className="block cursor-pointer"
                    >
                      <div className="p-2 hover:bg-[var(--color-3)] hover:text-[var(--color-2)] rounded">
                        <div className="text-sm font-semibold truncate">
                          {chat.messages[0]?.text || "Empty chat"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(chat.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <ul className="mb-3 p-3 font-bold pointer-events-auto cursor-pointer ">
                <div
                  onClick={() => setShowThemes((prev) => !prev)}
                  className="p-2 hover:bg-[var(--color-3)] hover:text-[var(--color-2)]"
                >
                  Theme
                  <i
                    className={`bx ml-2 ${
                      showThemes ? "bx-chevron-up " : "bx-chevron-down"
                    }`}
                  ></i>
                </div>

                <AnimatePresence>
                  {showThemes && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 mt-1 p-1 overflow-hidden"
                    >
                      {availableThemes.map((th, idx) => (
                        <li
                          key={idx}
                          className="relative mb-1 flex items-center justify-between pointer-events-auto cursor-pointer hover:bg-[var(--color-3)] hover:text-[var(--color-2)]"
                          onClick={() => changeTheme(th)}
                        >
                          {th}
                          {theme === th && (
                            <i className="bx bx-check ml-2 text-xl text-white"></i>
                          )}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </ul>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideBar;