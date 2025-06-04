import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaBookOpen,
  FaUpload,
  FaHistory,
  FaChartBar,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaBars,
  FaUserCircle,
  FaBook,
  FaClipboardList,
} from "react-icons/fa";
import Lectures from "./lectures";
import Courses from "./courses";
import SearchHistory from "./searchhistory";
import RecommendedVideos from "./recommendedvideos"; // ✅
import Analytics from "./analytics";
import Account from "./account";
import RegisterCourses from "./register";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // 💡 States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [student, setStudent] = useState({ name: "", department: "" });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [currentSearch, setCurrentSearch] = useState(""); // ✅ Correct order
  const [searchResult, setSearchResult] = useState(null)
  const [recommendedVideos, setRecommendedVideos] = useState([]);

  
  // 🌙 Theme toggling
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Updated useEffect for fetching recommendations
useEffect(() => {
  const fetchRecommendations = async () => {
    const studentId = localStorage.getItem("studentID");
    if (!studentId) {
      console.log('Student ID not available yet');
      return;
    }


    try {
       console.log("Fetching recommendations for student ID:", studentId);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:5000/recommendations/recommendations`, // Verify this endpoint
        {
          params: {
            user_id: studentId,
            user_type: "student"
          },
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

       console.log('Recommendations API Response:', response.data);
      //  setRecommendedVideos(response.data.recommendations);
       setRecommendedVideos(response.data?.recommendations || []);
      
    } catch (error) {
      console.error("Recommendation Fetch Error:", error);
      toast.error("Error fetching recommendations");
    }
  };

  fetchRecommendations();
}, [student.id]); // Only depend on student.id


  // 🛒 Load student info and search history
  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("studentInfo"));
    // if (storedStudent) setStudent(storedStudent);
    if (storedStudent) {
      setStudent(storedStudent)
      console.log("Student ID set:", storedStudent.id); 
      // Ensure student ID is also available separately if needed for API calls
      if (storedStudent.id) {
        localStorage.setItem("studentID", storedStudent.id)
        console.log("Student ID set:", storedStudent.id); 
      }
    }

    // const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    // setSearchHistory(history);
    const fetchHistory = async () => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      toast.error("Authorization token missing!");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/fetch_user_history/fetch_user_history", {
        // method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
        
      });

      const data =  response.data;

      setSearchHistory(data.history || []);
      
    } catch (error) {
      toast.error(error.response?.data?.error ||
        "Error fetching search history");
    }
  };

  fetchHistory();

    const keyword = JSON.parse(localStorage.getItem("currentSearch"));
    if (keyword) {
      setCurrentSearch(keyword);
      setActiveSection("dashboard");
      localStorage.removeItem("currentSearch");
    }

    setLoading(false);
  }, [location]); // re-run when location changes

  // ✨ Remove top <header> if exists
  useEffect(() => {
    const topHeader = document.querySelector("header");
    if (topHeader) topHeader.style.display = "none";
    return () => {
      if (topHeader) topHeader.style.display = "";
    };
  }, []);

  const handleSearch = async (e) => {
  e.preventDefault(); // Prevent form submission

  const trimmedTerm = searchTerm.trim(); // Trim spaces from the search term
  if (trimmedTerm === "") return; // If search term is empty, do nothing

 
  // Ensure that the student ID is available before making the API call
  const studentId = localStorage.getItem("studentID");
  if (!studentId) {
    toast.error("Student ID is missing. Please log in again.");
    navigate("/login");  // Redirect to login page if ID is missing
    return;
  }
  // Reset the search term in the input field
  setSearchTerm("");

  // Make an API call to search for videos based on the search term (ONLY TOP VIDEO)
  try {
    const response = await fetch("http://localhost:5000/search/search", {
      method: "POST",
      headers: { "Content-Type": "application/json",
                 "Authorization": `Bearer ${localStorage.getItem("authToken")}` // Add the token her
      },
      body: JSON.stringify({
        keyword: trimmedTerm,
        user_id: localStorage.getItem("studentID"), // Get student ID from localStorage
        user_type: "student",
      }),
    });

    const data = await response.json();

    if (response.ok && data.video_link) {
      // Update the UI with the search result (top video)
      setSearchResult({
        videoLink: data.video_link,
        thumbnail: data.thumbnail,
        title: data.title,
        description: data.description,
      });

       const newSearchItem = { search_query: trimmedTerm };
      const updatedHistory = [
        newSearchItem,
        ...searchHistory.filter((q) => q.search_query !== trimmedTerm),
      ].slice(0, 20);
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

      // ✅ Save to DB
      // await axios.post(
      //   "http://localhost:5000/save_user_history/save_search_history/save_search_history",
      //   {
      //     user_id: studentId,
      //     user_type: "student",
      //     search_query: trimmedTerm,
      //     searched_url: data.video_link,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // )

      // Show a success toast message
  toast.success(`🔍 Saved search: "${trimmedTerm}"`, {
    style: {
      backgroundColor: "#c0e8eb",
      color: "#12474b",
      fontWeight: "bold",
    },
    progressStyle: { background: "#2cb1bc" },
    toastId: "search-saved",
  });
  

      toast.success(`🎬 Video found: "${data.title}"`, {
        position: "top-right",
        autoClose: 1500,
        theme: "colored",
      });
    } else {
      toast.error(data.error || "No video found.");
    }
  } catch (error) {
    toast.error("Error during search.");
  }


};


  const handleWatchVideoClick = (keyword) => {
    toast.info(`🎬 Opening video for "${keyword}"`, {
      position: "top-right",
      autoClose: 1500,
      theme: "colored",
    });
  };

  const getNavItemClasses = (section) =>
    `flex items-center ${
      sidebarOpen ? "justify-start" : "justify-center"
    } gap-3 cursor-pointer p-2 rounded-md transition-all duration-300 transform hover:scale-105 ${
      activeSection === section
        ? "bg-[#b9e6e8] text-[#106d6d] dark:bg-[#1b9ba1] dark:text-white font-bold shadow-md"
        : "hover:bg-[#c0e8eb] dark:hover:bg-[#1e5c61] hover:font-semibold"
    }`;

const handleLogout = () => {
  localStorage.removeItem("studentInfo");
  localStorage.removeItem("searchHistory");
  localStorage.removeItem("currentSearch");

  toast.success("👋 Logged out successfully!", {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });

  setTimeout(() => {
    navigate("/"); // Navigate back to the trending videos (main page) after toast
  }, 1700); // 1700ms = after toast is shown (slightly more than autoClose)
};


  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#f2fafb] dark:bg-[#2d6a6e] text-[#12474b] dark:text-[#c0e8eb] flex"
    >
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-18"
        } transition-all duration-300 min-h-screen bg-[#c0e8eb] dark:bg-[#0f5c61] p-4 flex flex-col`}
      >
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <h2 className="text-2xl font-bold">YouTube Content Searching</h2>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars className="text-xl" />
          </button>
        </div>

        <button onClick={() => setDarkMode(!darkMode)} className="mt-4 mb-6">
          {darkMode ? (
            <FaSun className="text-xl" />
          ) : (
            <FaMoon className="text-xl" />
          )}
        </button>

        <nav className="space-y-2 text-lg">
          {[
            { section: "dashboard", label: "Dashboard", icon: <FaBook /> },
            {
                          section: "register-courses",
                          label: "Register Courses",
                          icon: <FaClipboardList />,
            },
            { section: "Courses", label: "Courses", icon: <FaUpload /> },
            // { section: "Lectures", label: "Lectures", icon: <FaBookOpen /> },
            
            {
              section: "search-history",
              label: "Search History",
              icon: <FaHistory />,
            },
            { section: "analytics", label: "Analytics", icon: <FaChartBar /> },
            {
              section: "account-details",
              label: "Account Details",
              icon: <FaUserCircle />,
            },
          ].map((item) => (
            <div
              key={item.section}
              onClick={() => setActiveSection(item.section)}
              className={getNavItemClasses(item.section)}
              title={!sidebarOpen ? item.label : ""}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          ))}

          <div
            className="flex items-center gap-3 cursor-pointer p-2 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-700"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            {sidebarOpen && <span>Logout</span>}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-8 pt-4 border-t border-gray-700 dark:border-gray-800">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2 mx-auto"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          ) : (
            <>
              <p className="font-bold">{student.name || "Student Name"}</p>
              <p className="text-xs italic text-gray-700 dark:text-[#d4e2e3]">
                {student.department || "Department"}
              </p>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <motion.main
        key={activeSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 px-6 md:px-10 py-8"
      >
        <ToastContainer />

        {activeSection === "dashboard" && (
          <>
            <h1 className="text-4xl font-bold text-center mb-10">
              Student Dashboard
            </h1>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="max-w-lg mx-auto mb-8 flex gap-2"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for videos..."
                className="flex-1 p-2 rounded border border-[#5c8b8e] text-[#5c8b8e] focus:outline-none focus:ring-2 focus:ring-[#2cb1bc]"
              />
              <button className="px-4 py-2 bg-[#2cb1bc] hover:bg-[#1b9ba1] text-white rounded shadow-md">
                Search
              </button>
            </form>

            {/* Top Video */}
            {searchResult && (
              <div className="bg-[#c0e8eb] dark:bg-[#0f5c61] p-6 rounded shadow-md mb-10">
                <h2 className="text-2xl font-bold mb-4">
                  Top Video Based on Metrics
                </h2>
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                     <img
                       src={searchResult.thumbnail}
                      alt="Video Thumbnail"
                      className="w-48 h-48 object-cover rounded-md"
                     />
                  </div>
                  <div className="flex flex-col  justify-between">
                    <h2 className="text-xl font-semibold mb-2"><b> {searchResult.title}</b> </h2> 
                    <p className="text-lg mb-2">
                      {/* Recommended Video for "{searchHistory[0]}" */}
                      Recommended Video for "{searchHistory.length > 0 ? searchHistory[0].search_query : 'No recent searches'}"

                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                       {searchResult.description} {/* Show video description */}
                    </p>
                    <div className="flex gap-6">
                        <button
                          onClick={() => handleWatchVideoClick(searchResult.videoLink, searchResult.title)} // Keep the toast
                          className="px-4 py-2 bg-[#2cb1bc] hover:bg-[#1b9ba1] text-white rounded shadow-md"
                        >
                          <a
                            href={searchResult.videoLink}  // Link to the video
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                             Watch Now
                          </a>
                        </button>
                    </div>
                  </div>
                </div>
               </div>
              )}

            {/* Recommended Section */}
            {recommendedVideos.length > 0 && (
               <div>
                  <h2 className="text-2xl font-bold mb-6">More Recommended Videos</h2>
                  <RecommendedVideos recommendedVideos={recommendedVideos} />
               </div>
            )}
          </>
        )}

        {activeSection === "Lectures" && <Outlet/>}
        {activeSection === "register-courses" && <RegisterCourses />}
        {activeSection === "Courses" && (<Courses setActiveSection={setActiveSection} /> )}
        {activeSection === "search-history" && (
          <SearchHistory setActiveSection={setActiveSection} />
        )}
        {activeSection === "analytics" && <Analytics />}
        {activeSection === "account-details" && <Account />}
      </motion.main>
    </motion.div>
  );
}

