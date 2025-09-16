import { Route, Routes, useLocation } from "react-router";
import "./App.css";
import Login from "./authpages/Login";
import Signup from "./authpages/Signup";
import Nav from "./components/Nav";
import HomeBackground from "./components/HomeBackground";
import Home from "./pages/Home";
import ChatPage from "./pages/Chat";
import Background from "./components/Background";
import { ThemeProvider } from "./components/ThemeContext";
import { ChatProvider } from "./components/ChatContext";

function App() {
  // localStorage.clear();

  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <ThemeProvider>
        <ChatProvider>
          <Nav />
          {isHome ? <HomeBackground /> : <Background />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/chatPage" element={<ChatPage />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
          </Routes>
        </ChatProvider>
      </ThemeProvider>
    </>
  );
}

export default App;