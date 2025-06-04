import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavbarWithDrawer from "./navbar";


const SignUp = () => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    institute: "",
    department: "",
    enrollment: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [darkMode, setDarkMode] = useState(false);
    
      const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark", !darkMode);
      };

  const institutes = [
    "Bahria University, E-8 Islamabad",
    "Air University Islamabad",
    "Sargodha University",
  ];

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      validatePassword(value);
    }
  };

  // Validate password strength
  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const maxLength = password.length <= 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (minLength && maxLength && hasUpperCase && hasLowerCase && hasSymbol && hasNumber) {
      setPasswordStrength("Strong Password");
    } else {
      setPasswordStrength("Weak Password (6-12 characters, must include uppercase, lowercase, number, symbol)");
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const requiredFields =
      role === "teacher"
        ? ["name", "username", "email", "password", "institute", "department"]
        : ["name", "username", "enrollment", "email", "password", "institute", "department"];

    const isEmpty = requiredFields.some((field) => !formData[field]);
    if (isEmpty) {
      setError("Please fill in all fields");
      return;
    }

    setError("");

    try {
      const endpoint =
        role === "teacher"
          ? "http://127.0.0.1:5000/teacher/signup"
          : "http://127.0.0.1:5000/student/signup";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      alert("Signup successful! Redirecting...");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <><NavbarWithDrawer darkMode={darkMode} toggleDarkMode={toggleDarkMode} /><div className="min-h-[calc(100vh-116px)] bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="bg-white dark:bg-dark-mode dark:text-dark-mode-grey-300 mx-8 w-full p-6 md:p-10 max-w-[500px] rounded-lg border-t-[5px] border-t-[#2cb1bc] shadow-lg">
        {!role ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Select Role</h2>
            <label className="block mb-2 font-medium" htmlFor="role">
              Choose Your Role
            </label>
            <select
              id="role"
              className="pl-3 py-2 mb-6 rounded-lg border w-full"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="teacher">Faculty Member</option>
              <option value="student">Student</option>
            </select>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center">
              {role === "teacher" ? "Faculty Member" : "Student"}
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="pl-3 py-2 mb-4 rounded-lg border w-full"
              onChange={handleChange} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="pl-3 py-2 mb-4 rounded-lg border w-full"
              onChange={handleChange} />
            {role === "student" && (
              <input
                type="text"
                name="enrollment"
                placeholder="Enrollment"
                className="pl-3 py-2 mb-4 rounded-lg border w-full"
                onChange={handleChange} />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="pl-3 py-2 mb-4 rounded-lg border w-full"
              onChange={handleChange} />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="pl-3 py-2 mb-4 rounded-lg border w-full"
                onChange={handleChange} />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <p
                className={`text-sm mt-1 ${passwordStrength === "Strong Password" ? "text-green-600" : "text-red-500"}`}
              >
                {passwordStrength}
              </p>
            </div>
            <label className="block mb-1 font-medium" htmlFor="institute">
              Institute
            </label>
            <select
              name="institute"
              className="pl-3 py-2 mb-4 rounded-lg border w-full"
              onChange={handleChange}
            >
              <option value="">Select Institute</option>
              {institutes.map((institute, index) => (
                <option key={index} value={institute}>
                  {institute}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="department"
              placeholder="Department"
              className="pl-3 py-2 mb-4 rounded-lg border w-full"
              onChange={handleChange} />
          </>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {role && (
          <button
            onClick={handleSubmit}
            className="bg-[#2cb1bc] rounded-lg text-lg py-3 text-white font-semibold w-full"
          >
            Sign Up
          </button>
        )}
      </div>
    </div></>
  );
};

export default SignUp;
