// CourseModules.jsx
import React, { useState, useEffect } from "react";
import {
  FaFolderOpen,
  FaVideo,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthToken, getAuthHeader } from "../SignIn"; // Import auth utilities

const CourseModules = () => {
  const [courses, setCourses] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    // Get token using the utility function
    const token = getAuthToken();
    
    if (!token) {
      toast.error("Authentication required. Please log in.");
      return;
    }
    
    try {
      const res = await fetch("http://localhost:5000/my_courses/my_courses", {
        headers: { ...getAuthHeader() }
      });
      if (!res.ok) throw new Error("Failed to load courses");
      const data = await res.json();
      // API returns [{ id, name }], but our UI also expects a `lectures: []` array:
      setCourses(data.map(c => ({ name: c.name, lectures: [] })));
    } catch (err) {
      toast.error(err.message);
    }
  };

 
  return (
    <div className="text-[#12474b] dark:text-[#c0e8eb]">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Your Course Modules
      </h2>
      
      {courses.length === 0 ? (
        <p className="text-center text-gray-600">No courses created yet.</p>
      ) : (
        <div className="space-y-6">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="border rounded-lg bg-white dark:bg-[#12474b] shadow p-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setOpenIndex(openIndex === idx ? null : idx)
                }
              >
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <FaFolderOpen />
                  {course.name}
                </div>
                {openIndex === idx ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {openIndex === idx && (
                <div className="mt-4 space-y-3">
                  {course.lectures.length > 0 ? (
                    course.lectures.map((lec, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 bg-[#e5fafa] dark:bg-[#0f3c3f] rounded"
                      >
                        <div className="flex items-center gap-2">
                          <FaVideo />
                          <span className="font-medium">{lec.title}</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {lec.views || 0} views • {lec.uploaded || "--"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No lectures uploaded yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseModules;