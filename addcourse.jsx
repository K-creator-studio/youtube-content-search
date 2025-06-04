// // // //Component Add course.
// // // import React, { useState } from "react";
// // // import { motion } from "framer-motion";
// // // import { toast } from "react-toastify";
// // // import "react-toastify/dist/ReactToastify.css";

// // // const AddCourseForm = ({ onAddCourse }) => {
// // //   const [courseName, setCourseName] = useState("");
// // //   const [courseId, setCourseId] = useState("");
// // //   const [error, setError] = useState("");

// // //   const handleSubmit = (e) => {
// // //     e.preventDefault();
// // //     if (!courseName.trim() || !courseId.trim()) {
// // //       setError("Both fields are required.");
// // //       toast.error("Please fill in both Course Name and Course ID.");
// // //       return;
// // //     }
// // //     setError("");
// // //     onAddCourse({ name: courseName.trim(), id: courseId.trim(), lectures: [] });
// // //     setCourseName("");
// // //     setCourseId("");
// // //     toast.success("Course added successfully!");
// // //   };

// // //   return (
// // //     <motion.div
// // //       initial={{ opacity: 0, y: 20 }}
// // //       animate={{ opacity: 1, y: 0 }}
// // //       transition={{ duration: 0.4 }}
// // //       className="mb-10"
// // //     >
// // //       <h2 className="text-3xl font-bold text-[#12474b] dark:text-[#c0e8eb] mb-6 text-center">
// // //         Add a New Course
// // //       </h2>
// // //       <form
// // //         onSubmit={handleSubmit}
// // //         className="bg-[#e5fafa] dark:bg-[#12474b] p-6 rounded-xl shadow-lg max-w-xl mx-auto space-y-4"
// // //       >
// // //         <input
// // //           type="text"
// // //           placeholder="Course ID"
// // //           value={courseId}
// // //           onChange={(e) => setCourseId(e.target.value)}
// // //           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] dark:bg-[#0f5c61] dark:text-[#c0e8eb]"
// // //         />
// // //         <input
// // //           type="text"
// // //           placeholder="Course Name"
// // //           value={courseName}
// // //           onChange={(e) => setCourseName(e.target.value)}
// // //           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] dark:bg-[#0f5c61] dark:text-[#c0e8eb]"
// // //         />

// // //         {error && <p className="text-red-600 text-sm text-center">{error}</p>}

// // //         <button
// // //           type="submit"
// // //           className="w-full bg-[#2cb1bc] hover:bg-[#1e97a3] text-white font-semibold py-3 rounded-lg transition duration-200"
// // //         >
// // //           Add Course
// // //         </button>
// // //       </form>
// // //     </motion.div>
// // //   );
// // // };

// // // export default AddCourseForm;

// // // AddCourse.jsx
// // import React, { useState } from "react";
// // import { motion } from "framer-motion";
// // import { toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // const AddCourseForm = ({ onCourseAdded }) => {
// //   const [courseId, setCourseId]     = useState("");
// //   const [courseName, setCourseName] = useState("");
// //   const [error, setError]           = useState("");

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!courseId.trim() || !courseName.trim()) {
// //       setError("Both fields are required.");
// //       toast.error("Please fill in both Course ID and Course Name.");
// //       return;
// //     }
// //     setError("");

// //     const token = localStorage.getItem("token");
// //     try {
// //       const res = await fetch("http://localhost:5000/add_course/add_course", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type":  "application/json",
// //           "Authorization": `Bearer ${token}`
// //         },
// //         body: JSON.stringify({
// //           course_id:   courseId.trim(),
// //           course_name: courseName.trim()
// //         })
// //       });

// //       const data = await res.json();
// //       if (!res.ok) throw new Error(data.error || "Failed to add course");
      

// //       // onAddCourse({
// //       //   id:       courseId.trim(),
// //       //   name:     courseName.trim(),
// //       //   lectures: []
// //       // });
// //       // Call the correct function with the right data
// //       if (typeof onCourseAdded === 'function') {
// //         onCourseAdded();  // tell the parent to re-fetch the list
// //       }


// //       // success!
// //       setCourseId("");
// //       setCourseName("");
// //       toast.success(data.message || "Course added successfully!");
// //       onCourseAdded();  // tell the parent to re-fetch the list

// //     } catch (err) {
// //       setError(err.message);
// //       toast.error(err.message);
// //     }
// //   };

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       transition={{ duration: 0.4 }}
// //       className="mb-10"
// //     >
// //       <h2 className="text-3xl font-bold text-[#12474b] dark:text-[#c0e8eb] mb-6 text-center">
// //         Add a New Course
// //       </h2>
// //       <form
// //         onSubmit={handleSubmit}
// //         className="bg-[#e5fafa] dark:bg-[#12474b] p-6 rounded-xl shadow-lg max-w-xl mx-auto space-y-4"
// //       >
// //         <input
// //           type="text"
// //           placeholder="Course ID"
// //           value={courseId}
// //           onChange={(e) => setCourseId(e.target.value)}
// //           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] dark:bg-[#0f5c61] dark:text-[#c0e8eb]"
// //         />
// //         <input
// //           type="text"
// //           placeholder="Course Name"
// //           value={courseName}
// //           onChange={(e) => setCourseName(e.target.value)}
// //           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] dark:bg-[#0f5c61] dark:text-[#c0e8eb]"
// //         />

// //         {error && <p className="text-red-600 text-sm text-center">{error}</p>}

// //         <button
// //           type="submit"
// //           className="w-full bg-[#2cb1bc] hover:bg-[#1e97a3] text-white font-semibold py-3 rounded-lg transition duration-200"
// //         >
// //           Add Course
// //         </button>
// //       </form>
// //     </motion.div>
// //   );
// // };

// // export default AddCourseForm;

// // AddCourse.jsx
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AddCourseForm = ({ onAddCourse, onCourseAdded }) => {
//   const [courseId, setCourseId] = useState("");
//   const [courseName, setCourseName] = useState("");
//   const [error, setError] = useState("");
//   const [tokenDebug, setTokenDebug] = useState("");

//   // Debug function to check token
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setTokenDebug(`Token in localStorage: ${token ? "exists" : "missing"}`);
    
//     // Test the debug endpoint
//     if (token) {
//       fetch("http://localhost:5000/add_course/debug-token", {
//         headers: { "Authorization": `Bearer ${token}` }
//       })
//       .then(res => res.json())
//       .then(data => {
//         console.log("Token debug response:", data);
//         setTokenDebug(prev => `${prev}\nServer received: ${JSON.stringify(data.headers)}`);
//       })
//       .catch(err => {
//         console.error("Token debug error:", err);
//         setTokenDebug(prev => `${prev}\nError: ${err.message}`);
//       });
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!courseId.trim() || !courseName.trim()) {
//       setError("Both fields are required.");
//       toast.error("Please fill in both Course ID and Course Name.");
//       return;
//     }
//     setError("");

//     // Get token from localStorage
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("You are not logged in. Please log in first.");
//       toast.error("Authentication required");
//       return;
//     }

//     try {
//       console.log("Sending request with token:", token);
      
//       const res = await fetch("http://localhost:5000/add_course/add_course", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           course_id: courseId.trim(),
//           course_name: courseName.trim()
//         })
//       });

//       const data = await res.json();
//       console.log("Response:", data);
      
//       if (!res.ok) throw new Error(data.error || "Failed to add course");

//       // Call the correct callback function
//       if (typeof onAddCourse === 'function') {
//         onAddCourse({
//           id: courseId.trim(),
//           name: courseName.trim(),
//           lectures: []
//         });
//       }
      
//       if (typeof onCourseAdded === 'function') {
//         onCourseAdded();
//       }

//       // Reset form
//       setCourseId("");
//       setCourseName("");
//       toast.success(data.message || "Course added successfully!");

//     } catch (err) {
//       console.error("Error adding course:", err);
//       setError(err.message);
//       toast.error(err.message);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="mb-10"
//     >
//       <h2 className="text-3xl font-bold text-[#12474b] dark:text-[#c0e8eb] mb-6 text-center">
//         Add a New Course
//       </h2>
      
//       {/* Debug info - remove in production */}
//       {tokenDebug && (
//         <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-2 mb-4 rounded text-xs whitespace-pre-line">
//           <strong>Debug:</strong> {tokenDebug}
//         </div>
//       )}
      
//       <form
//         onSubmit={handleSubmit}
//         className="bg-[#e5fafa] dark:bg-[#12474b] p-6 rounded-xl shadow-lg max-w-xl mx-auto space-y-4"
//       >
//         <input
//           type="text"
//           placeholder="Course ID"
//           value={courseId}
//           onChange={(e) => setCourseId(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] dark:bg-[#0f5c61] dark:text-[#c0e8eb]"
//         />
//         <input
//           type="text"
//           placeholder="Course Name"
//           value={courseName}
//           onChange={(e) => setCourseName(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] dark:bg-[#0f5c61] dark:text-[#c0e8eb]"
//         />

//         {error && <p className="text-red-600 text-sm text-center">{error}</p>}

//         <button
//           type="submit"
//           className="w-full bg-[#2cb1bc] hover:bg-[#1e97a3] text-white font-semibold py-3 rounded-lg transition duration-200"
//         >
//           Add Course
//         </button>
//       </form>
//     </motion.div>
//   );
// };

// export default AddCourseForm;

// // AddCourse.jsx
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { getAuthToken, getAuthHeader } from "./SignIn"; // Import auth utilities

// const AddCourseForm = ({ onAddCourse, onCourseAdded }) => {
//   const [courseId, setCourseId] = useState("");
//   const [courseName, setCourseName] = useState("");
//   const [error, setError] = useState("");
//   const [tokenDebug, setTokenDebug] = useState("");

//   // Debug function to check token
//   useEffect(() => {
//     const token = getAuthToken();
//     setTokenDebug(`Token in localStorage: ${token ? "exists" : "missing"}`);
    
//     // Test the debug endpoint if we have a token
//     if (token) {
//       fetch("http://localhost:5000/add_course/debug-token", {
//         headers: { ...getAuthHeader() }
//       })
//       .then(res => res.json())
//       .then(data => {
//         console.log("Token debug response:", data);
//         setTokenDebug(prev => `${prev}\nServer received: ${JSON.stringify(data.headers)}`);
//       })
//       .catch(err => {
//         console.error("Token debug error:", err);
//         setTokenDebug(prev => `${prev}\nError: ${err.message}`);
//       });
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!courseId.trim() || !courseName.trim()) {
//       setError("Both fields are required.");
//       toast.error("Please fill in both Course ID and Course Name.");
//       return;
//     }
//     setError("");

//     // Get token using the utility function
//     const token = getAuthToken();
//     if (!token) {
//       setError("You are not logged in. Please log in first.");
//       toast.error("Authentication required");
//       return;
//     }

//     try {
//       console.log("Sending request with token:", token);
      
//       const res = await fetch("http://localhost:5000/add_course/add_course", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...getAuthHeader()
//         },
//         body: JSON.stringify({
//           course_id: courseId.trim(),
//           course_name: courseName.trim()
//         })
//       });

//       const data = await res.json();
//       console.log("Response:", data);
      
//       if (!res.ok) throw new Error(data.error || "Failed to add course");

//       // Call the correct callback function
//       if (typeof onAddCourse === 'function') {
//         onAddCourse({
//           id: courseId.trim(),
//           name: courseName.trim(),
//           lectures: []
//         });
//       }
      
//       if (typeof onCourseAdded === 'function') {
//         onCourseAdded();
//       }

//       // Reset form
//       setCourseId("");
//       setCourseName("");
//       toast.success(data.message || "Course added successfully!");

//     } catch (err) {
//       console.error("Error adding course:", err);
//       setError(err.message);
//       toast.error(err.message);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="mb-10"
//     >
//       <h2 className="text-3xl font-bold text-[#12474b] dark:text-[#c0e8eb] mb-6 text-center">
//         Add a New Course
//       </h2>
      
//       {/* Debug info - remove in production */}
//       {tokenDebug && (
//         <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-2 mb-4 rounded text-xs whitespace-pre-line">
//           <strong>Debug:</strong> {tokenDebug}
//         </div>
//       )}
      
//       <form
//         onSubmit={handleSubmit}
//         className="bg-[#e5fafa] dark:bg-[#12474b] p-6 rounded-xl shadow-lg max-w-xl mx-auto space-y-4"
//       >
//         <input
//           type="text"
//           placeholder="Course ID"
//           value={courseId}
//           onChange={(e) => setCourseId(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] dark:bg-[#0f5c61] dark:text-[#c0e8eb]"
//         />
//         <input
//           type="text"
//           placeholder="Course Name"
//           value={courseName}
//           onChange={(e) => setCourseName(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2cb1bc] dark:bg-[#0f5c61] dark:text-[#c0e8eb]"
//         />

//         {error && <p className="text-red-600 text-sm text-center">{error}</p>}

//         <button
//           type="submit"
//           className="w-full bg-[#2cb1bc] hover:bg-[#1e97a3] text-white font-semibold py-3 rounded-lg transition duration-200"
//         >
//           Add Course
//         </button>
//       </form>
//     </motion.div>
//   );
// };

// export default AddCourseForm;


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