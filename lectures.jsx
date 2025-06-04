import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  FaSearch,
  FaFilePdf,
  FaFileVideo,
  FaSortAlphaDown,
  FaSortNumericDown,
} from "react-icons/fa";

const mockLectures = [
  {
    id: 1,
    courseId: "1",
    title: "Intro to Machine Learning",
    date: "2025-04-01",
    type: "pdf",
    file: "/files/ml_intro.pdf",
  },
  {
    id: 2,
    courseId: "2",
    title: "Neural Networks Basics",
    date: "2025-04-03",
    type: "video",
    file: "https://www.youtube.com/embed/aircAruvnKk",
  },
  {
    id: 3,
    courseId: "2",
    title: "Deep Learning Overview",
    date: "2025-04-06",
    type: "pdf",
    file: "/files/deep_learning_overview.pdf",
  },
];

export default function Lectures() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get("id");

  const [lectures, setLectures] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    const fetchLectures = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        setLectures([]);
        return;
      }
      if (!courseId) {
        console.warn("No course ID provided");
        setLectures([]);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/get_student_lectures/get_student_lectures?course_id=${courseId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch lectures:", errorData.error || response.statusText);
          setLectures([]);
          return;
        }

        const data = await response.json();
        console.log("Backend lectures data:", data);

        const fetchedLectures = data.lectures?.length
          ? data.lectures.map((lec) => ({
              id: lec.lecture_id || lec.id || lec.lectureId || lec._id || "unknown",
              courseId: courseId,
              title: lec.lecture_title || "Untitled Lecture",
              type: lec.file_type?.includes("pdf") ? "pdf" : "video",
              file: lec.lecture_url || "",
              lecture_id: lec.lecture_id || lec.id || lec.lectureId || lec._id || "unknown",
              date: lec.created_at ? new Date(lec.created_at).toLocaleDateString() : "N/A",
            }))
          : [];

        setLectures(fetchedLectures);
      } catch (error) {
        console.error("Error fetching lectures:", error);
        setLectures([]);
      }
    };

    fetchLectures();
  }, [courseId]);

  const handleViewVideo = async (lecture) => {
    try {
      console.log("Lecture object:", lecture);
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please login first.");
        return;
      }

      const lectureId = lecture.lecture_id || lecture.id || lecture.lectureId || lecture._id;
      if (!lectureId || lectureId === "unknown") {
        console.error("Lecture object:", lecture);
        alert(`Lecture ID missing. Available fields: ${Object.keys(lecture).join(", ")}`);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/find_video/find_video?course_id=${courseId}&lecture_id=${lectureId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Video not found.");
        return;
      }

      setVideoData({
        video_url: data.video_url,
        video_title: data.video_title || "Clipped Video",
        is_youtube: data.is_youtube || false,
        embed_url: data.embed_url || data.video_url,
      });
      setShowVideoModal(true);
    } catch (error) {
      console.error("Video fetch error:", error);
      alert("Error loading video: " + error.message);
    }
  };

  const filtered = lectures
    .filter(
      (l) =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (typeFilter === "all" || l.type === typeFilter)
    )
    .sort((a, b) => {
      if (sortMode === "alpha") return a.title.localeCompare(b.title);
      if (sortMode === "date") {
        const dateA = new Date(a.date === "N/A" ? 0 : a.date);
        const dateB = new Date(b.date === "N/A" ? 0 : b.date);
        return dateB - dateA;
      }
      return 0;
    });

  const itemsPerPage = filtered.length || 10;
  const paginated = filtered;
  const totalPages = 1;

  const renderPreview = (lecture) => {
    if (lecture.type === "pdf") {
      return (
        <iframe
          src={lecture.file}
          className="w-full h-64"
          title={lecture.title}
        />
      );
    } else if (lecture.type === "video") {
      return <p>Click "View Video" to watch the lecture video.</p>;
    }
    return <p>No preview available</p>;
  };

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-2">Lectures</h1>
        <p className="text-lg text-gray-600 italic">
          Access and explore your course lectures
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center border border-gray-400 rounded px-3 py-2">
          <FaSearch className="mr-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search lectures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none w-full bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortMode("alpha")}
            className="px-3 py-2 bg-[#2cb1bc] hover:bg-[#1b9ba1] text-white rounded"
          >
            <FaSortAlphaDown className="inline mr-1" /> A-Z
          </button>
          <button
            onClick={() => setSortMode("date")}
            className="px-3 py-2 bg-[#2cb1bc] hover:bg-[#1b9ba1] text-white rounded"
          >
            <FaSortNumericDown className="inline mr-1" /> Date
          </button>
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 rounded border border-gray-400 text-[#12474b]"
        >
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
        </select>
      </div>

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {paginated.map((lecture) => (
          <div key={lecture.id} className="p-6 bg-[#c0e8eb] dark:bg-[#0f5c61] rounded-xl shadow">
            <a
              href={lecture.file}
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <h2 className="text-xl font-bold mb-2">{lecture.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Date: {lecture.date} • Type: {lecture.type.toUpperCase()}
              </p>
            </a>
            <div className="pl-2 pt-2">
              {lecture.type === "video" && (
                <button
                  onClick={() => handleViewVideo(lecture)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  View Video
                </button>
              )}
            </div>
            {renderPreview(lecture)}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500">No lectures found.</p>
        )}
      </motion.div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-full border ${
                i + 1 === currentPage
                  ? "bg-[#2cb1bc] text-white font-bold"
                  : "bg-white text-[#2cb1bc] border-[#2cb1bc]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showVideoModal && videoData && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl bg-black rounded-lg p-4">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-2 right-2 text-white text-3xl font-bold"
              aria-label="Close video"
            >
              &times;
            </button>
            {videoData.is_youtube ? (
              <iframe
                width="100%"
                height="400"
                src={videoData.embed_url}
                title={videoData.video_title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded"
              />
            ) : (
              <video
                src={videoData.video_url}
                controls
                autoPlay
                className="w-full h-auto rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
