// AddCourse.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthToken, getAuthHeader } from "../SignIn"; // Import auth utilities

const AddCourseForm = ({ onAddCourse, onCourseAdded }) => {
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId.trim() || !courseName.trim()) {
      setError("Both fields are required.");
      toast.error("Please fill in both Course ID and Course Name.");
      return;
    }
    setError("");

    // Get token using the utility function
    const token = getAuthToken();
    if (!token) {
      setError("You are not logged in. Please log in first.");
      toast.error("Authentication required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/add_course/add_course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
        body: JSON.stringify({
          course_id: courseId.trim(),
          course_name: courseName.trim()
        })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to add course");

      // Call the correct callback function
      if (typeof onAddCourse === 'function') {
        onAddCourse({
          id: courseId.trim(),
          name: courseName.trim(),
          lectures: []
        });
      }
      
      if (typeof onCourseAdded === 'function') {
        onCourseAdded();
      }

      // Reset form
      setCourseId("");
      setCourseName("");
      toast.success(data.message || "Course added successfully!");

    } catch (err) {
      console.error("Error adding course:", err);
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-10"
    >
      <h2 className="text-3xl font-bold text-[#12474b] dark:text-[#c0e8eb] mb-6 text-center">
        Add a New Course
      </h2>
      
      <form
        onSubmit={handleSubmit}
        className="bg-[#e5fafa] dark:bg-[#12474b] p-6 rounded-xl shadow-lg max-w-xl mx-auto space-y-4"
      >
        <input
          type="text"
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] dark:bg-[#0f5c61] dark:text-[#c0e8eb]"
        />
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] dark:bg-[#0f5c61] dark:text-[#c0e8eb]"
        />

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#2cb1bc] hover:bg-[#1e97a3] text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Add Course
        </button>
      </form>
    </motion.div>
  );
};

export default AddCourseForm;
