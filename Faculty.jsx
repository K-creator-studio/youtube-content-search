import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaBook,
  FaChalkboardTeacher,
  FaBars,
  FaLink,
  FaHistory,
  FaMoon,
  FaSun,
  FaChartBar,
} from "react-icons/fa";

import AccountTabs from "./account";
import CourseModules from "./coursemodules";
import UploadMaterials from "./uploadmaterials";
import AddCourseForm from "./addcourse";
import SearchHistory from "./searchhistory";
import SearchBar from "./searchbar";
import Analytics from "./analytics";
import RecommendedVideos from "./recommendedvideos";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: "", department: "" });
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // for error handling

  // Fetch user details and search history from localStorage
  useEffect(() => {
    setUserDetails({
      name: localStorage.getItem("facultyName") || "",
      department: localStorage.getItem("facultyDept") || "",
    });
    setKeywords(JSON.parse(localStorage.getItem("searchHistory")) || []);
  }, []);

  // Handle dark mode toggle
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
  }, []);

  // Apply dark mode styles
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Fetch recommended videos based on search history (keywords)
  useEffect(() => {
    if (keywords.length > 0) fetchRecommendedVideos();
  }, [keywords]);

  // Fetches recommended videos based on search history on page load initially
  useEffect(() => {
    fetchRecommendedVideos();
  }, []);

  // Get initials from user name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("");
  };

  // Fetch recommended videos from the API
  const fetchRecommendedVideos = async () => {
    setLoading(true);
    setErrorMessage(null); // Clear any previous errors
    try {
      const res = await fetch(
        `http://localhost:5000/recommendations/recommendations?user_id=${localStorage.getItem(
          "facultyID"
        )}&user_type=teacher`
      );
      const data = await res.json();
      if (res.ok) {
        setRecommended(data.recommendations); // Updates the recommended state
      } else {
        setErrorMessage(data.error || "No recommended videos.");
      }
    } catch (error) {
      setErrorMessage("Error fetching recommendations.");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Handle search query
  const handleSearch = async (term) => {
    if (!term) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/search/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: term,
          user_id: localStorage.getItem("facultyID") || "1",
          user_type: "teacher",
        }),
      });
      const r = await res.json();
      if (res.ok && r.video_link) {
        setKeywords((prev) => [term, ...prev.slice(0, 19)]);
        setSearchResult({
          videoLink: r.video_link,
          thumbnail: r.thumbnail,
          title: r.title,
          description: r.description,
        });
      } else {
        setErrorMessage(r.error || "No video found.");
      }
    } catch {
      setErrorMessage("Error during search.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses for the faculty
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/course/my_courses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load courses");
        const data = await res.json();
        setCourses(data.map((c) => ({ id: c.id, name: c.name, lectures: [] })));
      } catch (e) {
        console.error(e);
      }
    };
    fetchCourses();
  }, [refresh]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex bg-gradient-to-br from-[#f2fafb] to-[#e8f5f8] dark:from-[#144c4f] dark:to-[#0f3b3f] text-[#12474b] dark:text-[#c0e8eb]"
    >
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300 min-h-screen bg-[#c0e8eb] dark:bg-[#0f5c61] p-4 fixed top-0 left-0 z-20 shadow-md`}
      >
        <div className="flex items-center justify-between mb-4">
          {sidebarOpen && (
            <h2 className="text-2xl font-bold">YouTube Content Searching</h2>
          )}
        </div>
        <button
          className="mb-6 text-xl hover:scale-110 transition-transform"
          onClick={() => setSidebarOpen((o) => !o)}
        >
          <FaBars />
        </button>
        <nav className="space-y-5 text-lg">
          {" "}
          {[
            ["dashboard", <FaBook />, "Dashboard"],
            ["modules", <FaChalkboardTeacher />, "Course Modules"],
            ["lectures", <FaLink />, "Upload Materials"],
            ["history", <FaHistory />, "Search History"],
            ["analytics", <FaChartBar />, "Analytics"],
            ["account", <FaUserCircle />, "Account"],
            ["", "", "---------------------------"],
            ["logout", <FaSignOutAlt />, "Logout"],
          ].map(([section, Icon, label]) => (
            <motion.div
              key={section}
              className={`flex items-center gap-3 cursor-pointer hover:font-semibold hover:text-[#0b3437] dark:hover:text-white ${
                section === "logout" &&
                " hover:text-red-600 dark:hover:text-red-500 "
              }`}
              whileHover={{ scale: 1.03 }}
              onClick={() =>
                section === "logout"
                  ? handleLogout()
                  : setActiveSection(section)
              }
            >
              {Icon} {sidebarOpen && label}
            </motion.div>
          ))}
        </nav>
      </aside>

      {/* Top NavBar */}
      <div className="absolute top-0 right-0 w-fit rounded-l-lg h-16 z-30 bg-[#c0e8eb] dark:bg-[#0f5c61] flex items-center justify-end px-6 shadow-md pl-64">
        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="hover:scale-110 transition-transform"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
          <div
            className="flex items-center gap-2 ml-2 cursor-pointer relative"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <div
              className="w-8 h-8 bg-[#12474b] text-white flex items-center justify-center rounded-full font-bold text-xs"
              title={userDetails.name}
            >
              {getInitials(userDetails.name)}
            </div>
          </div>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-10 right-0 bg-white dark:bg-[#144c4f] rounded shadow-md p-2 w-32 text-sm z-40"
              >
                <div
                  onClick={handleLogout}
                  className="hover:bg-gray-100 dark:hover:bg-[#1c5d61] p-2 rounded cursor-pointer flex items-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-24 px-6 md:px-10 ml-16 md:ml-64">
        <h1 className="text-4xl font-bold text-center mb-10">
          Faculty Dashboard
        </h1>

        {activeSection === "dashboard" && (
          <>
            <div className="max-w-lg mx-auto mb-8">
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>
            {recommended.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-10">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                  alt="No Search"
                  className="w-32 h-32 mb-4 opacity-70 animate-pulse"
                />
                <p className="text-center text-base font-medium text-gray-600 dark:text-gray-300">
                  No searches found.
                </p>
              </div>
            ) : (
              <RecommendedVideos
                keywords={keywords}
                topVideo={searchResult}
                recommended={recommended}
                loading={loading}
                errorMessage={errorMessage} // Pass error message
              />
            )}
          </>
        )}

        {activeSection === "account" && <AccountTabs />}
        {activeSection === "lectures" && <UploadMaterials key={refresh} />}
        {activeSection === "modules" && (
          <>
            <AddCourseForm onAddCourse={() => setRefresh((r) => r + 1)} />
            <CourseModules courses={courses} />
          </>
        )}
        {activeSection === "analytics" && <Analytics chartData={{}} />}
        {activeSection === "history" && <SearchHistory />}
      </main>
    </motion.div>
  );
};

export default FacultyDashboard;
