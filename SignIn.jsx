
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarWithDrawer from "./navbar";


// Authentication utilities
const TOKEN_KEY = "authToken";

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  // Clear any other auth-related items
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
  localStorage.removeItem("facultyID");
  localStorage.removeItem("studentID")
};

export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// SignIn Component
const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  
    const toggleDarkMode = () => {
      setDarkMode(!darkMode);
      document.documentElement.classList.toggle("dark", !darkMode);
    };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/login/login", formData);
      const { token, role, user_id } = response.data;

      // Use the utility function to store the token
      setAuthToken(token);
      
      // Store other user data
      
      if (role === "teacher") {
        localStorage.setItem("facultyID", user_id);  // Save faculty ID
      } else if (role === "student") {
        localStorage.setItem("studentID", user_id);  // Save student ID
      }

      localStorage.setItem("userRole", role);

      // Redirect based on role
      if (role === "teacher") {
        navigate("/faculty");
      } else if (role === "student") {
        navigate("/student");
      } else {
        setError("Invalid role detected.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <><NavbarWithDrawer darkMode={darkMode} toggleDarkMode={toggleDarkMode} /><div className="min-h-[calc(100vh-116px)] bg-slate-50 dark:bg-[#1f7c84] flex flex-col justify-center items-center p-6">
      <div className="bg-white dark:bg-[#0f7076] dark:text-dark-mode-grey-300 mx-8 w-full p-6 md:p-10 max-w-[500px] rounded-lg border-t-[5px] border-t-[#2dd2d4] shadow-lg">
        <h2 className="text-3xl dark:text-[#d0f0f3] font-bold mb-6 text-center">Sign In</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="pl-3 py-2 mb-4 rounded-lg border w-full dark:bg-[#d0f0f3] dark:text-[#042a2f]"
          onChange={handleChange} />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="pl-3 py-2 mb-4 rounded-lg border w-full dark:bg-[#d0f0f3] dark:text-[#042a2f]"
            onChange={handleChange} />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm"
          >
            {showPassword ? "🔒" : "👁️"}
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          className="bg-[#2cb1bc] rounded-lg text-lg py-3 text-white dark:bg-[#d0f0f3] hover:dark:bg-[#ccfbf7] dark:text-[#042a2f] font-semibold w-full"
        >
          Sign In
        </button>

        <p className="mt-4 text-center dark:text-[#d0f0f3]">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#2cb1bc] dark:text-[#15b2b7] font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div></>
  );
};

export default SignIn;