import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ProfileIcon from "../components/ProfileIcon";

function Sign_up() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setIsAuthenticated(parsedUser.isAuthenticated);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };
    checkAuth();
  }, []);

  // Load image from localStorage on component mount
  useEffect(() => {
    const storedImage = localStorage.getItem("image");
    if (storedImage) {
      setImagePreview(storedImage);
    }
  }, []);

  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-xl text-gray-300">You are already logged in!</p>
        <button 
          onClick={() => navigate("/chatpage")}
          className="mt-4 px-6 py-2 bg-[var(--color-1)] text-white rounded-lg hover:bg-[var(--color-3)] transition-colors"
        >
          Go to Chat
        </button>
      </div>
    );
  }

  // Handle image upload
  const ImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("image", reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateAll = () => {
    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
      setError("Username can only contain letters, numbers, '.' and '_'");
      return false;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateAll()) {
      return;
    }

    try {
      // Try backend registration first
      const response = await axios.post("http://localhost:3000/auth/register", {
        username,
        email,
        password,
        confirmPassword,
      });

      if (response.status === 201) {
        // Store user data in localStorage
     
        navigate("/login");
        window.location.reload();
      }
    } catch (error) {
      // If backend fails, fall back to frontend registration
      setError(error.response.data.msg)
    }
  };

  return (
    <>
      {/* Form container */}
      <div
        className="mx-auto mt-4 flex flex-col items-center justify-center bg-[rgba(126,97,171,0.25)] backdrop-transparent border-4 border-[var(--color-3)] rounded-2xl"
        style={{ height: "70vh", width: "80%", maxWidth: "520px" }}
      >
        {error && (
          <div className="text-red-500 mt-2 text-center w-[80%]">{error}</div>
        )}
        
        {/* Username field */}
        <div className="flex items-center justify-center w-[80%] h-[9%] mt-3 border-2 border-[var(--color-3)] rounded-xl bg-transparent font-[ZenDots] shadow-lg">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full h-full bg-transparent text-[#F5F5F5] p-5 focus:outline-none"
          />
          <div className="profile flex items-center justify-center mr-1.5">
            <ProfileIcon size={28} color={"#e3e3e3"} />
          </div>
        </div>

        {/* Email field */}
        <div className="flex items-center justify-center w-[80%] h-[9%] mt-3 border-2 border-[var(--color-3)] rounded-xl bg-transparent font-[ZenDots] shadow-lg">
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-full bg-transparent text-[#F5F5F5] p-5 focus:outline-none"
          />
          <div
            className="w-8 h-8 bg-center bg-no-repeat p-5"
            style={{ backgroundImage: "url('/public/mail.svg')" }}
          ></div>
        </div>

        {/* Password field */}
        <div className="flex items-center justify-center w-[80%] h-[9%] mt-3 border-2 border-[var(--color-3)] rounded-xl bg-transparent font-[ZenDots] shadow-lg">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-full bg-transparent text-[#F5F5F5] p-5 focus:outline-none"
          />
          <div
            className="w-8 h-8 bg-center bg-no-repeat p-5"
            style={{ backgroundImage: "url('/public/lock.svg')" }}
          ></div>
        </div>

        {/* Confirm Password field */}
        <div className="flex items-center justify-center w-[80%] h-[9%] mt-3 border-2 border-[var(--color-3)] rounded-xl bg-transparent font-[ZenDots] shadow-lg">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full h-full bg-transparent text-[#F5F5F5] p-5 focus:outline-none"
          />
          <div
            className="w-8 h-8 bg-center bg-no-repeat p-5"
            style={{ backgroundImage: "url('/public/lock.svg')" }}
          ></div>
        </div>

        {/* Profile image upload */}
        <div className="input-img w-[80%] mt-3 h-28 border-2 border-dashed border-gray-300 text-[#F5F5F5] rounded-xl flex items-center justify-center relative">
          {imagePreview && (
            <button
              onClick={() => {
                localStorage.removeItem("image");
                setImagePreview(null);
              }}
              className="absolute top-[-8px] right-2 text-3xl text-[#F5F5F5] hover:text-gray-700"
            >
              &times;
            </button>
          )}

          <label
            htmlFor="image-upload"
            className="absolute text-4xl text-[#F5F5F5] cursor-pointer"
          >
            +
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={ImageChange}
          />
          {imagePreview && (
            <img
              id="preview"
              src={imagePreview}
              alt="Image Preview"
              className="w-full h-full object-cover rounded-xl"
            />
          )}
        </div>

        {/* Sign up button */}
        <div className="flex items-center justify-center w-full h-[18%] mt-4">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-[80%] sm:w-[330px] h-[50px] rounded-xl bg-[var(--color-1)] shadow-lg text-white font-semibold flex items-center justify-center hover:bg-gray-300 hover:text-[var(--color-2)] hover:cursor-pointer transition duration-300"
          >
            Sign up
          </button>
        </div>

        {/* Link to Log in */}
        <div className="w-full flex items-end justify-center text-[#AEAEAE] font-[ZenDots] flex-grow">
          <span className="p-2">
            You have an account?{" "}
            <button
              className="text-[#F8E7F6] font-bold cursor-pointer bg-transparent border-none p-2 hover:underline hover:text-[#AEAEAE]"
              onClick={() => navigate("/login")}
            >
              Log in!
            </button>
          </span>
        </div>
      </div>
      
      {/* Help/contact section */}
      <div className="w-full flex items-center justify-center fixed bottom-0 p-4 font-[ZenDots] text-[#AEAEAE] z-10">
        <span className="flex items-center justify-center w-full text-center">
          If you have a problem,
          <a className="ml-2 text-blue-500 hover:underline" href="">
            contact us!
          </a>
        </span>
      </div>
    </>
  );
}

export default Sign_up;
