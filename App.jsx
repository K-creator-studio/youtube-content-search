
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./Home.jsx";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import FacultyDashboard from "./Faculty/Faculty";
import StudentDashboard from "./Student/Student";
import Lectures from "./Student/lectures"; // Adjust path if needed

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/faculty" element={<FacultyDashboard />} />

        {/* Nested routes for student */}
        <Route path="/student" element={<StudentDashboard />}>
          {/* Nested route for lectures */}
          <Route path="lectures" element={<Lectures />} />
          {/* You can add more nested routes here if needed */}
        </Route>
      </Routes>

      <footer className="text-base text-center bg-[#d5eff2] dark:bg-[#16595e]">
        <div className="shadow-2xl text-[#12474b] p-4 dark:text-[#c0e8eb]">
          <div className="shadow-2xl">
            YouTube Content Searching &copy; {new Date().getFullYear()} CopyRights Reserved
          </div>
        </div>
      </footer>
    </BrowserRouter>
  );
};

export default App;

