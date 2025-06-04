// SearchHistory.jsx
import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import axios from "axios";

const SearchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("authToken"); // ✅ Correct token key
      const response = await axios.get("http://localhost:5000/fetch_user_history/fetch_user_history", {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.history) {
        setHistory(response.data.history);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    // ❗Note: This only clears local storage, not from server
    localStorage.removeItem("searchHistory");
    setHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-4">
        <FaHistory className="text-lg text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-semibold">Search History</h2>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No search history found.
        </p>
      ) : (
        <ul className="space-y-2">
          {history.map((item, index) => (
            <li
              key={index}
              className="text-gray-700 dark:text-gray-200 border-b pb-1 flex flex-col"
            >
              <span className="font-semibold">{item.search_query}</span>
              <a
                href={item.searched_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm"
              >
                {item.searched_url}
              </a>
            </li>
          ))}
        </ul>
      )}

      {history.length > 0 && (
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={clearHistory}
        >
          Clear Local History
        </button>
      )}
    </div>
  );
};

export default SearchHistory;
