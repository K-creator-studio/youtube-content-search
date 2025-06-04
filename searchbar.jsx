import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch, loading }) => {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (!keyword.trim()) return;
    onSearch(keyword);
    setKeyword("");
  };

  return (
    <div className="w-full max-w-xl flex items-center relative mb-6">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-full px-4 py-2 border rounded-lg dark:bg-[#12474b] dark:text-[#c0e8eb]"
        placeholder="Search for Keyword..."
        disabled={loading}
      />
      <button
        onClick={handleSearch}
        className="absolute right-3 text-[#16595e] dark:text-[#c0e8eb]"
        disabled={loading}
      >
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;
