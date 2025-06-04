// Analytics.jsx

import React, { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSearchesCount, setTotalSearchesCount] = useState(0);

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedHistory);
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    let start = 0;
    const end = searchHistory.length;
    if (end > 0) {
      let timer = setInterval(() => {
        start += 1;
        setTotalSearchesCount(start);
        if (start === end) clearInterval(timer);
      }, 50);
      return () => clearInterval(timer);
    } else {
      setTotalSearchesCount(0);
    }
  }, [searchHistory]);

  const topKeywords = [...searchHistory].reduce((acc, keyword) => {
    acc[keyword] = (acc[keyword] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(topKeywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword, count]) => ({ keyword, count }));

  const mostSearched = chartData.length > 0 ? chartData[0].keyword : "-";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="w-16 h-16 border-4 border-t-4 border-[#2cb1bc] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-10 py-8"
    >
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-4">Analytics Overview</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 italic">
          Your personalized content insights!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-[#c0e8eb] dark:bg-[#0f5c61] rounded-xl shadow-md"
        >
          <h2 className="text-xl font-bold mb-2">Total Searches</h2>
          <p className="text-4xl font-extrabold">{totalSearchesCount}</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 bg-[#c0e8eb] dark:bg-[#0f5c61] rounded-xl shadow-md"
        >
          <h2 className="text-xl font-bold mb-2">Recent Searched Keyword</h2>
          <p className="text-2xl font-semibold text-[#2cb1bc]">
            {mostSearched}
          </p>
        </motion.div>
      </div>

      {chartData.length > 0 ? (
        <div className="w-full h-96 bg-[#c0e8eb] dark:bg-[#0f5c61] p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Top 5 Keywords
          </h2>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="keyword"
                stroke="#12474b"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                stroke="#12474b"
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#2cb1bc" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-lg text-gray-600 dark:text-gray-300 font-medium">
          No enough data to show analytics!
        </div>
      )}

      {searchHistory.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Last 3 Searches</h2>
          <div className="flex flex-col gap-3">
            {searchHistory.slice(0, 3).map((keyword, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-2 bg-[#c0e8eb] dark:bg-[#0f5c61] rounded-xl shadow-md"
              >
                {keyword}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
