import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

const ProfileBar = ({ displayProfileList, setDisplayProfileList }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
          setIsAuthenticated(parsedUser.isAuthenticated);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  const handleLogout = async () => {
    try {
      if (userData?.token) {
        const response = await fetch('http://localhost:3000/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData?.token}`
          },
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Logout failed:', errorData);
        }
      }

      localStorage.removeItem('user');
      setUserData(null);
      setIsAuthenticated(false);
      setDisplayProfileList(false);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.removeItem('user');
      setUserData(null);
      setIsAuthenticated(false);
      setDisplayProfileList(false);
      navigate('/login');
    }
  };

  return (
    <>
      <AnimatePresence>
        {displayProfileList && (
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="z-10 fixed top-2 right-2 w-72 bg-[var(--color-1)] text-[var(--color-3)] rounded-lg shadow-lg transition-transform transform translate-x-0"
          >
            <div className="flex justify-start p-2">
              <button
                onClick={() => setDisplayProfileList(false)}
                className="text-2xl hover:text-red-500"
              >
                <i className="bx bx-x"></i>
              </button>
            </div>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setDisplayProfileList(false)}
                  className={`${
                    location.pathname === "/login" && "text-[var(--color-2)]"
                  }`}
                >
                  <ul className="mb-3 ml-2 p-2 font-bold cursor-pointer hover:text-[var(--color-2)] hover:bg-[var(--color-3)]">
                    Log in
                  </ul>
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setDisplayProfileList(false)}
                  className={`${
                    location.pathname === "/signup" && "text-[var(--color-2)]"
                  }`}
                >
                  <ul className="mb-3 ml-2 p-2 font-bold cursor-pointer hover:text-[var(--color-2)] hover:bg-[var(--color-3)]">
                    Sign up
                  </ul>
                </Link>
              </>
            ) : (
              <>
                <ul className="mb-3 ml-2 p-2 font-bold text-[var(--color-2)]">
                  Welcome, {userData?.username}
                </ul>
                <Link
                  to="/chatpage"
                  onClick={() => setDisplayProfileList(false)}
                  className={`${
                    location.pathname === "/chatpage" && "text-[var(--color-2)]"
                  }`}
                >
                  <ul className="mb-3 ml-2 p-2 font-bold cursor-pointer hover:text-[var(--color-2)] hover:bg-[var(--color-3)]">
                    Chat
                  </ul>
                </Link>
                <ul className="mb-3 ml-2 p-2 font-bold cursor-pointer hover:text-red-500 hover:bg-[var(--color-3)]">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    Log out{" "}
                    <span className="text-xl font-bold">
                      <i className="bx bx-log-out"></i>
                    </span>
                  </button>
                </ul>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileBar;