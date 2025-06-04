     
import React, { useState, useEffect } from "react";
import { getAuthToken, getAuthHeader } from "../SignIn";

import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const UploadMaterials = () => {
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [lecturesByCourse, setLecturesByCourse] = useState({});
  const [selectedCourseIdx, setSelectedCourseIdx] = useState(null);
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("date");
  const [dragActive, setDragActive] = useState(false);

  // Video modal & data
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    fetchCoursesAndLectures();
  }, []);

  useEffect(() => {
    fetchLectures();
  }, [selectedCourseIdx]);

  const fetchCoursesAndLectures = async () => {
    try {
      const res = await fetch("http://localhost:5000/my_lectures/my_lectures", {
        headers: getAuthHeader(),
      });
      const data = await res.json();

      const courseMap = {};
      const lectureMap = {};

      data.forEach((lec) => {
        if (!courseMap[lec.course_id]) {
          courseMap[lec.course_id] = {
            id: lec.course_id,
            course_title: lec.course_name,
          };
          lectureMap[lec.course_id] = [];
        }
        lectureMap[lec.course_id].push({
          lecture_id: lec.lecture_id,
          title: lec.lecture_title,
        });
      });

      setTeacherCourses(Object.values(courseMap));
      setLecturesByCourse(lectureMap);
    } catch (err) {
      toast.error("Error fetching your lectures.");
    }
  };

  const fetchLectures = async () => {
    try {
      const courseId = selectedCourseIdx !== null ? teacherCourses[selectedCourseIdx].id : "";
      const url = `http://localhost:5000/my_lectures/my_lectures${courseId ? `?course_id=${courseId}` : ""}`;

      const res = await fetch(url, {
        headers: getAuthHeader(),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch lectures");

      const grouped = {};
      data.forEach((lec) => {
        if (!grouped[lec.course_id]) grouped[lec.course_id] = [];
        grouped[lec.course_id].push({
          lecture_id: lec.lecture_id,
          title: lec.lecture_title,
          uploaded: lec.created_at,
          type: lec.file_type || "application/pdf",
          url: lec.lecture_url,
          duration: "N/A",
          views: Math.floor(Math.random() * 100),
          course_id: lec.course_id,
        });
      });

      setLecturesByCourse(grouped);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filterAndSort = (arr) => {
    let list = [...arr];
    if (filter !== "all") list = list.filter((l) => l.type.includes(filter));
    if (sort === "alphabetical") list.sort((a, b) => a.title.localeCompare(b.title));
    else list.sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded));
    return list.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()));
  };

  const getIcon = (type) => {
    if (!type || typeof type !== "string") return <span>📄</span>;
    if (type.includes("pdf")) return <FaFilePdf />;
    if (type.includes("word")) return <FaFileWord />;
    if (type.includes("powerpoint")) return <FaFilePowerpoint />;
    return <span>📄</span>;
  };

  const handleUpload = async () => {
    if (selectedCourseIdx === null || !file) {
      toast.error("Select a course and a file first.");
      return;
    }
    const course = teacherCourses[selectedCourseIdx];

    const form = new FormData();
    form.append("course_id", course.id);
    form.append("lecture_title", file.name);
    form.append("file", file);

    const token = getAuthToken();
    const res = await fetch("http://localhost:5000/add_lecture/add_lecture", {
      method: "POST",
      headers: getAuthHeader(),
      body: form,
    });
    const json = await res.json();
    if (!res.ok) return toast.error(json.error || "Upload failed");

    setLecturesByCourse((byCourse) => ({
      ...byCourse,
      [course.id]: [
        ...byCourse[course.id],
        {
          title: file.name,
          uploaded: new Date().toISOString(),
          type: file.type,
          views: Math.floor(Math.random() * 100),
          duration: "N/A",
        },
      ],
    }));
    setFile(null);
    toast.success("Lecture uploaded!");
    fetchLectures();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      toast.info("File selected");
    }
  };

  // This is your original Find Video button handler — you need to implement this
  // const checkVideoOnly = (lectureTitle) => {
  //   toast.info(`Find Video clicked for: ${lectureTitle}`);
  //   // Add your own logic here if you want for "Find Video"
  // };

  const checkVideoOnly = async (lecture) => {
    console.log('checkVideoOnly triggered', lecture);
    const courseId = lecture.course_id || (selectedCourseIdx !== null ? teacherCourses[selectedCourseIdx]?.id : null);
    const lectureId = lecture.lecture_id;

    if (!courseId || !lectureId) {
     toast.error("Missing course or lecture ID.");
      return;
    }

    toast.info("Finding related video...");

    try {
      const res = await fetch(
        `http://localhost:5002/video_finding_combine/video_finding_combine?course_id=${courseId}&lecture_id=${lectureId}`,
        {
          headers: getAuthHeader(),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No video found");

      setVideoData({
        video_url: data.video_url,
        video_title: data.video_title || "Found Video",
        is_youtube: data.video_url.includes("youtube"), // optional: to distinguish player type
      });

      setShowVideoModal(true);
      toast.success("Video found!");
    } catch (err) {
      toast.error(err.message || "Failed to find video");
    }
  };


  const findVideo = async (courseId, lectureId) => {
    toast.info("Fetching video...");
    try {
      const res = await fetch(
        `http://localhost:5000/find_video/find_video?course_id=${courseId}&lecture_id=${lectureId}`,
        {
          headers: getAuthHeader(),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Video not found");

      // setVideoData(data);
      // setShowVideoModal(true);
      // Extract time in seconds from interval strings
const timeToSeconds = (timeStr) => {
  const parts = timeStr.split(":").map(Number);
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
  };

  const videoUrl = data.video_url;
  setVideoData({
    video_url: videoUrl,
    video_title: "Clipped Video",
    is_youtube: false,  // force <video> player
});

  setShowVideoModal(true)
  toast.success("Video ready!");
} catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Upload Lectures</h2>

      <div
        className={`flex gap-3 mb-6 p-4 border-2 rounded-xl ${
          dragActive ? "border-[#2cb1bc] bg-[#d9f8fa]" : "border-gray-300"
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <select
          value={selectedCourseIdx ?? ""}
          onChange={(e) =>
            setSelectedCourseIdx(e.target.value === "" ? null : parseInt(e.target.value, 10))
          }
          className="p-3 border rounded-lg"
        >
          <option value="">Select Course</option>
          {teacherCourses.map((c, idx) => (
            <option key={c.id} value={idx}>
              {c.course_title || c.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-3 rounded-lg"
        />
        <button onClick={handleUpload} className="bg-[#2cb1bc] text-white px-6 py-3 rounded-lg">
          Upload
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded-lg w-full max-w-xs"
        />
        <select onChange={(e) => setFilter(e.target.value)} className="p-3 border rounded-lg" value={filter}>
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="msword">DOCX</option>
          <option value="vnd.ms-powerpoint">PPT</option>
        </select>
        <select onChange={(e) => setSort(e.target.value)} className="p-3 border rounded-lg" value={sort}>
          <option value="date">Sort by Date</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      {Object.keys(lecturesByCourse).length > 0 && (
        <div className="grid gap-4">
          <h3 className="text-xl font-semibold mb-2">
            {selectedCourseIdx !== null
              ? teacherCourses[selectedCourseIdx]?.course_title || "Selected Course"
              : "All Lectures"}
          </h3>

          {filterAndSort(
            selectedCourseIdx !== null && teacherCourses[selectedCourseIdx]
              ? lecturesByCourse[teacherCourses[selectedCourseIdx].id] || []
              : Object.values(lecturesByCourse).flat()
          ).map((lec, idx) => (
            <motion.div key={idx} className="p-4 border rounded-xl bg-[#e5fafa]">
              <a href={lec.url} target="_blank" rel="noopener noreferrer" className="block">
                <motion.div className="p-4 border rounded-xl bg-[#e5fafa] hover:bg-[#d2f0f2] cursor-pointer transition">
                  <div className="flex items-center gap-3 mb-1">
                    {getIcon(lec.type)}
                    <h4 className="font-semibold">{lec.title}</h4>
                  </div>
                  <p className="text-xs">
                    {lec.type} | Uploaded: {new Date(lec.uploaded).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    Views: {lec.views} | Duration: {lec.duration}
                  </p>
                </motion.div>
              </a>
              <div className="pl-2 pt-2">
                <button
                  onClick={() => checkVideoOnly(lec)}
                  className="mr-2 bg-gray-400 text-white px-3 py-1 rounded"
                >
                  Find Video
                </button>
                <button
                  onClick={() => {
                    const courseId =
                      lec.course_id ||
                      (selectedCourseIdx !== null ? teacherCourses[selectedCourseIdx]?.id : null);
                    if (!courseId) {
                      toast.error("Course ID is missing.");
                      return;
                    }
                    findVideo(courseId, lec.lecture_id);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  View Video
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        )}

      {/* Video Modal */}
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
              <video src={videoData.video_url} controls autoPlay className="w-full rounded" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMaterials;
