import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaFolderOpen } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Courses({ setActiveSection }) {
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [openCourseId, setOpenCourseId] = useState(null); // Changed from index to id
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegisteredCourses = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/get_registered_courses/get_registered_courses", {
          method: "GET",
          headers: {
            "Authorization": token,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch courses:", errorData.error || response.statusText);
          return;
        }

        const data = await response.json();
        // Transform API response into the format expected by this component
        const courses = data.courses.map((course) => ({
          course: { id: course.course_id, title: course.course_name },
          teacher: { name: course.teacher_name },
        }));

        setRegisteredCourses(courses);
      } catch (error) {
        console.error("Error fetching registered courses:", error);
      }
    };

    fetchRegisteredCourses();
  }, []);

  const toggleCollapse = (courseId) => {
    setOpenCourseId((prevId) => (prevId === courseId ? null : courseId));
  };

  const handleViewLectures = (courseId) => {
    setActiveSection("Lectures");
    console.log("Navigating to:", `/student/lectures?id=${courseId}`);
    navigate(`/student/lectures?id=${courseId}`);
  };

  return (
    <motion.div
      className="px-6 md:px-10 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-2">My Courses</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 italic">
          Your registered learning paths.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {registeredCourses.map((course, index) => {
          const courseId = course.course.id;
          const isOpen = openCourseId === courseId;

          return (
            <div
              key={`${course.course.title}-${course.teacher.name}-${index}`}
              className="bg-[#c0e8eb] dark:bg-[#0f5c61] p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-semibold">
                    {course.course.title}
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    with {course.teacher.name}
                  </p>
                </div>
                <button onClick={() => toggleCollapse(courseId)}>
                  {isOpen ? (
                    <FaChevronUp className="text-lg" />
                  ) : (
                    <FaChevronDown className="text-lg" />
                  )}
                </button>
              </div>

              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4"
                >
                  <button
                    onClick={() => handleViewLectures(courseId)}
                    className="w-full px-4 py-2 bg-[#2cb1bc] hover:bg-[#1b9ba1] text-white rounded shadow-md flex items-center justify-center gap-2"
                  >
                    <FaFolderOpen /> View Lectures
                  </button>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
