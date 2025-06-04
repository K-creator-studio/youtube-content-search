import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaSearch, FaBroom } from "react-icons/fa";
import axios from "axios";

export default function SearchHistory({ setActiveSection }) {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const storedHistory =
  //     JSON.parse(localStorage.getItem("searchHistory")) || [];
  //   setHistory(storedHistory);
  // }, []);
  // After: Fetch history from backend and use localStorage as a backup
useEffect(() => {
  const fetchHistory = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Authorization token missing!");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/fetch_user_history/fetch_user_history", {
        // method: "GET",
        headers: { 
          Authorization:  `Bearer ${token}`,
          //  Authorization: token,
 },
         
      });

      const data = response.data;

      // setHistory(data.history || []);
      setHistory([...data.history].reverse());
      
    } catch (error) {
      toast.error( error.response?.data?.error || "Error fetching search history");
    }
  };

  fetchHistory();
}, []); // Fetch history on component mount


  const clearHistory = () => {
    localStorage.removeItem("searchHistory");
    setHistory([]);
    toast.success("🧹 Search history cleared!", {
      toastId: "clear-history",
      style: {
        backgroundColor: "#c0e8eb",
        color: "#12474b",
        fontWeight: "bold",
      },
      progressStyle: { background: "#2cb1bc" },
    });
  };

  const handleKeywordClick = (searchQuery) => {
    localStorage.setItem("currentSearch", JSON.stringify(searchQuery));
    if (setActiveSection) {
      setActiveSection("dashboard"); // set back to dashboard
    } else {
      navigate("/student"); // fallback (if outside the dashboard)
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-10 py-8"
    >
      <ToastContainer position="top-right" autoClose={2000} theme="light" />

      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-4">Search History</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 italic">
          View and manage your previous searches!
        </p>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
            No searches found!
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {history.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleKeywordClick(item.search_query)}
              className="w-full max-w-md px-6 py-3 bg-[#c0e8eb] dark:bg-[#0f5c61] rounded-xl shadow-md flex items-center gap-3 text-[#12474b] dark:text-[#c0e8eb] text-md font-semibold cursor-pointer hover:shadow-lg"
            >
              <FaSearch className="text-[#2cb1bc] dark:text-[#2cb1bc]" />
              <span>{item.search_query}</span>
              <a
                href={item.searched_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm"
              >
                {item.searched_url}
              </a>

             
            </motion.div>
          ))}
          <motion.button
            onClick={clearHistory}
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            className="mt-10 px-6 py-3 bg-[#2cb1bc] hover:bg-[#1b9ba1] text-white rounded-full shadow-lg hover:shadow-xl transform transition-all flex items-center gap-2"
          >
            <FaBroom className="text-white" /> Clear All
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
