// components/AccountTabs.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const AccountTabs = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    degree: "",
    experience: "",
    research: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("facultyProfile"));
    if (saved) setFormData(saved);
  }, []);

  useEffect(() => {
    if (formData.firstName || formData.department) {
      localStorage.setItem(
        "facultyName",
        `${formData.firstName} ${formData.lastName}`
      );
      localStorage.setItem("facultyDept", formData.degree || "Department");
    }
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("facultyProfile", JSON.stringify(formData));
    toast.success("Changes saved successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-[#0e4d4f] p-6 rounded-xl shadow-lg"
    >
      <div className="flex gap-4 mb-6 border-b pb-2">
        {[
          ["personal", "Personal Info"],
          ["academic", "Academic"],
          ["settings", "Settings"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={`$${
              activeTab === key
                ? "font-bold border-b-2 border-[#2cb1bc] text-[#2cb1bc]"
                : "text-gray-600"
            } px-2 transition-colors duration-200`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "personal" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] shadow-sm"
            />
            <input
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] shadow-sm"
            />
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] shadow-sm"
            />
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] shadow-sm"
            />
          </div>
          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] shadow-sm"
          />
          <button
            onClick={handleSave}
            className="bg-[#2cb1bc] hover:bg-[#239ba1] transition text-white py-2 px-6 rounded-lg shadow-md"
          >
            Save Changes
          </button>
        </motion.div>
      )}

      {activeTab === "academic" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold">Academic Information</h2>
          <input
            name="degree"
            placeholder="Highest Degree"
            value={formData.degree}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] shadow-sm"
          />
          <textarea
            name="experience"
            placeholder="Experience & Teaching Summary"
            value={formData.experience}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] shadow-sm"
          />
          <input
            name="research"
            placeholder="Research Interests"
            value={formData.research}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] shadow-sm"
          />
          <button
            onClick={handleSave}
            className="bg-[#2cb1bc] hover:bg-[#239ba1] transition text-white py-2 px-6 rounded-lg shadow-md"
          >
            Save Changes
          </button>
        </motion.div>
      )}

      {activeTab === "settings" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold">Account Settings</h2>
          <input
            placeholder="Current password"
            type="password"
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] shadow-sm"
          />
          <input
            placeholder="New password"
            type="password"
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] shadow-sm"
          />
          <input
            placeholder="Confirm password"
            type="password"
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] shadow-sm"
          />
          <div className="flex items-center gap-4">
            <label>Email Notifications</label>
            <button className="bg-[#2cb1bc] text-white py-1 px-4 rounded shadow">
              Toggle
            </button>
          </div>
          <div className="flex items-center gap-4">
            <label>Student Messages</label>
            <button className="bg-[#2cb1bc] text-white py-1 px-4 rounded shadow">
              Toggle
            </button>
          </div>
          <button
            onClick={handleSave}
            className="bg-[#2cb1bc] hover:bg-[#239ba1] transition text-white py-2 px-6 rounded-lg shadow-md"
          >
            Save Changes
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AccountTabs;
