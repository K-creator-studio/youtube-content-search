import axios from "axios";
import NavbarWithDrawer from "./navbar";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


const Home = () => {
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/trending/trending")
      .then((response) => {
        console.log("Trending Videos:", response.data);
        setTrendingVideos(response.data.items);
      })
      .catch((error) => {
        console.error("Error fetching trending videos:", error);
      });
  }, []);

  return (
    <><NavbarWithDrawer darkMode={darkMode} toggleDarkMode={toggleDarkMode} /><div className="min-h-screen w-full mb-5 bg-[#f2fafb] dark:bg-[#1f7c84] flex flex-col items-center px-4 md:px-12">
      {/* Hero Section */}
      <motion.div
        className="text-center mt-12 mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#12474b] dark:text-white mb-4">
          Discover What's Recent on YouTube
        </h1>
        <p className="text-lg md:text-xl text-[#367a81] dark:text-[#d9f7ff]">
          Stay ahead with the latest trends. Sign up to explore personalized
          content!
        </p>
      </motion.div>

      {/* SignUp Button */}
      <Link
        to="/signup"
        className="bg-[#12474b] text-white px-6 py-3 rounded-full hover:bg-[#0e383b] transition duration-300 mb-16"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Sign Up to Explore More
      </Link>

      {/* Trending Videos Section */}
      <div className="w-full max-w-[1440px] flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-2 md:px-0">
          {trendingVideos.map((video, index) => (
            <motion.div
              key={video.id}
              className="flex gap-4 bg-[#d5eff2] dark:bg-[#16595e] dark:text-[#c0e8eb] rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-md flex-shrink-0" />
              <div className="flex flex-col justify-between">
                <div className="relative group mb-2">
                  <h3 className="text-base sm:text-lg font-semibold line-clamp-2">
                    {video.snippet.title}
                  </h3>
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-10 w-64 max-w-sm">
                    {video.snippet.title}
                  </div>
                </div>

                <p className="text-sm mb-2 line-clamp-2">
                  {video.snippet.description.substring(0, 80)}...
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-300 underline text-sm"
                >
                  Watch Video
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div></>
  );
};

export default Home;
