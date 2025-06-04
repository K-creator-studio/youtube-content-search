// Account.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import Confetti from "react-confetti";
import "react-toastify/dist/ReactToastify.css";

export default function Account() {
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    department: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    department: "",
    email: "",
  });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("studentInfo"));
    if (storedStudent) {
      setStudentInfo({
        ...storedStudent,
        email: storedStudent.email || "student@example.com",
      });
      setFormState({
        name: storedStudent.name || "",
        department: storedStudent.department || "",
        email: storedStudent.email || "student@example.com",
      });
    }
    setTimeout(() => setLoading(false), 200);
  }, []);

  const handleSave = () => {
    setStudentInfo(formState);
    localStorage.setItem("studentInfo", JSON.stringify(formState));
    setEditing(false);
    toast.success("🎉 Profile updated successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        backgroundColor: "#c0e8eb",
        color: "#12474b",
        fontWeight: "bold",
      },
      progressStyle: {
        background: "#2cb1bc",
      },
    });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleCancel = () => {
    setFormState(studentInfo);
    setEditing(false);
  };

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
      {showConfetti && (
        <Confetti numberOfPieces={500} recycle={true} gravity={0.5} />
      )}
      <ToastContainer />
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-2">Account Details</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 italic">
          Manage and view your profile information
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-[#c0e8eb] dark:bg-[#276c71] p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Student Profile</h2>
        <div className="flex flex-col gap-4">
          {["name", "department", "email"].map((field) => (
            <div key={field} className="flex justify-between items-center">
              <span className="font-semibold capitalize">{field}:</span>
              {editing ? (
                <input
                  type="text"
                  value={formState[field]}
                  onChange={(e) =>
                    setFormState({ ...formState, [field]: e.target.value })
                  }
                  className="ml-2 p-1 rounded border border-[#add1d4] w-1/2 bg-[#c0e8eb] text-teal-950"
                />
              ) : (
                <span>{studentInfo[field] || "N/A"}</span>
              )}
            </div>
          ))}
          <div className="flex justify-between">
            <span className="font-semibold">Account Created:</span>
            <span>January 2025 (Mock)</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Last Login:</span>
            <span>Today</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-10">
          {editing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={handleSave}
                className="px-6 py-2 bg-[#1b4c4f] hover:bg-[#236166] text-[#d4e2e3] rounded-full shadow-md hover:shadow-lg transform transition-all duration-300"
              >
                Save Changes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={handleCancel}
                className="px-6 py-2 bg-[#1b4c4f] hover:bg-[#236166] text-[#d4e2e3] rounded-full shadow-md hover:shadow-lg transform transition-all duration-300"
              >
                Cancel
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={() => setEditing(true)}
              className="px-6 py-2 bg-[#1b4c4f] hover:bg-[#236166] text-[#d4e2e3] rounded-full shadow-md hover:shadow-lg transform transition-all duration-300"
            >
              Edit Profile
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
