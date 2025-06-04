// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // dummy teacher data with courses
// // eslint-disable-next-line react-refresh/only-export-components
// export const mockTeachers = [
//   {
//     id: 1,
//     name: "Dr. John Doe",
//     courses: [
//       { id: 1, title: "AI Fundamentals" },
//       { id: 2, title: "Deep Learning" },
//     ],
//   },
//   {
//     id: 2,
//     name: "Prof. Jane Smith",
//     courses: [
//       { id: 3, title: "Web Development" },
//       { id: 4, title: "React Basics" },
//     ],
//   },
//   {
//     id: 3,
//     name: "Ms. Sara Lee",
//     courses: [
//       { id: 5, title: "Data Science" },
//       { id: 6, title: "Machine Learning" },
//     ],
//   },
// ];

// export default function RegisterCourses() {
//   const [selectedTeacherId, setSelectedTeacherId] = useState("");
//   const [selectedCourseId, setSelectedCourseId] = useState("");
//   const [registeredCourses, setRegisteredCourses] = useState([]);

//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("registeredCourses")) || [];
//     setRegisteredCourses(saved);
//   }, []);

//   const selectedTeacher = mockTeachers.find(
//     (t) => t.id === parseInt(selectedTeacherId)
//   );

//   const handleRegister = () => {
//     if (!selectedTeacherId || !selectedCourseId) {
//       toast.error("Please select both teacher and course");
//       return;
//     }

//     const course = selectedTeacher?.courses?.find(
//       (c) => c.id === parseInt(selectedCourseId)
//     );

//     const teacher = selectedTeacher;

//     if (!course || !teacher) {
//       toast.error("Invalid teacher or course");
//       return;
//     }

//     const alreadyRegistered = registeredCourses.some(
//       (entry) =>
//         entry.course.id === course.id && entry.teacher.id === teacher.id
//     );

//     if (alreadyRegistered) {
//       toast.error("Already registered");
//       return;
//     }

//     const newEntry = { course, teacher };
//     const updated = [...registeredCourses, newEntry];
//     setRegisteredCourses(updated);
//     localStorage.setItem("registeredCourses", JSON.stringify(updated));

//     toast.success(`✅ Registered for ${course.title} with ${teacher.name}`);
//   };

//   const handleUnregister = (index) => {
//     const updated = [...registeredCourses];
//     updated.splice(index, 1);
//     setRegisteredCourses(updated);
//     localStorage.setItem("registeredCourses", JSON.stringify(updated));
//     toast.success("❌ Course unregistered successfully");
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//       className=" px-6 py-10 "
//     >
//       <ToastContainer />
//       <div className=" flex flex-col items-center">
//         <div className="text-center mb-10">
//           <h1 className="text-5xl font-bold mb-2">Register Courses</h1>
//           <p className="text-lg text-gray-600 dark:text-gray-300 italic">
//             Select a teacher and course to register.
//           </p>
//         </div>

//         <div className="w-full max-w-5xl bg-[#c0e8eb] dark:bg-[#0f5c61] p-10 md:p-14 rounded-xl shadow-xl">
//           <div className="mb-6">
//             <label className="block mb-2 text-lg font-semibold text-[#12474b] dark:text-[#c0e8eb]">
//               Select a teacher:
//             </label>
//             <select
//               className="w-full p-3 rounded border border-gray-400 text-[#12474b] dark:text-white dark:bg-[#0f5c61]"
//               value={selectedTeacherId}
//               onChange={(e) => {
//                 setSelectedTeacherId(e.target.value);
//                 setSelectedCourseId(""); // reset course on teacher change
//               }}
//             >
//               <option value="">Choose a teacher</option>
//               {mockTeachers.map((teacher) => (
//                 <option key={teacher.id} value={teacher.id}>
//                   {teacher.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {selectedTeacher && (
//             <div className="mb-6">
//               <label className="block mb-2 text-lg font-semibold text-[#12474b] dark:text-[#c0e8eb]">
//                 Select a course:
//               </label>
//               <select
//                 className="w-full p-3 rounded border border-gray-400 text-[#12474b] dark:text-white dark:bg-[#0f5c61]"
//                 value={selectedCourseId}
//                 onChange={(e) => setSelectedCourseId(e.target.value)}
//               >
//                 <option value="">-- Choose a course --</option>
//                 {selectedTeacher.courses.map((course) => (
//                   <option key={course.id} value={course.id}>
//                     {course.title}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           <button
//             onClick={handleRegister}
//             className="w-full mt-2 px-6 py-2 bg-[#2cb1bc] hover:bg-[#1b9ba1] text-white rounded shadow-md transition-all duration-300"
//           >
//             Register
//           </button>

//           {registeredCourses.length > 0 && (
//             <div className="mt-8">
//               <h2 className="text-2xl font-bold mb-4 text-[#12474b] dark:text-[#c0e8eb]">
//                 Registered Courses
//               </h2>
//               {registeredCourses.map((entry, index) => (
//                 <div
//                   key={index}
//                   className="mb-6 bg-white dark:bg-[#144c4c] p-4 rounded-lg shadow-sm"
//                 >
//                   <div className="flex justify-between items-center">
//                     <h3 className="font-semibold text-lg text-[#12474b] dark:text-white">
//                       {entry.course.title} <br />
//                       <span className="text-sm font-normal">
//                         with {entry.teacher.name}
//                       </span>
//                     </h3>
//                     <button
//                       onClick={() => handleUnregister(index)}
//                       className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow-sm"
//                     >
//                       Unregister
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// You kept your exported mockTeachers for UI usage, but we will override it with fetched teachers internally
export const mockTeachers = [];

export default function RegisterCourses() {
  const [mockTeachers, setMockTeachers] = useState([]); // will fetch from backend instead of static data
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [registeredCourses, setRegisteredCourses] = useState([]);

  // Fetch token for Authorization header
  const token = localStorage.getItem("authToken") || "";

  useEffect(() => {
    if (!token) {
      toast.error("No auth token found. Please login.");
      return;
    }

    // 1. Fetch teachers in student's department and convert to your mockTeachers shape
    fetch("http://localhost:5000/get_department_teachers/get_department_teachers", {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.teachers) {
          // Convert backend teachers to your mockTeachers format
          // Backend returns: [{teacher_id, teacher_name}, ...]
          // You expect: [{id, name, courses: []}]
          const teachersWithEmptyCourses = data.teachers.map((t) => ({
            id: t.teacher_id,
            name: t.teacher_name,
            courses: [], // courses to be fetched on teacher select
          }));
          setMockTeachers(teachersWithEmptyCourses);
        } else {
          toast.error(data.error || "Failed to load teachers");
        }
      })
      .catch(() => toast.error("Failed to load teachers"));

    // 2. Fetch registered courses from backend and set in your registeredCourses state
    fetch("http://localhost:5000/get_registered_courses/get_registered_courses", {
      headers: { Authorization: token},
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) {
          // Your backend returns courses with fields: course_id, course_name, teacher_name
          // Your registeredCourses expect entries like:
          // { course: { id, title }, teacher: { id, name } }
          // We have teacher_name but no teacher_id from backend for registered courses,
          // So we set teacher id as null or try to find it in mockTeachers later.

          const regCourses = data.courses.map((c) => ({
            course: { id: c.course_id, title: c.course_name },
            teacher: { id: null, name: c.teacher_name },
          }));
          setRegisteredCourses(regCourses);
        } else {
          toast.error(data.error || "Failed to load registered courses");
        }
      })
      .catch(() => toast.error("Failed to load registered courses"));
  }, [token]);

  // When teacher changes, fetch courses for that teacher and update that teacher's courses in mockTeachers
  const handleTeacherChange = (e) => {
    const teacherId = e.target.value;
    setSelectedTeacherId(teacherId);
    setSelectedCourseId("");

    if (!teacherId) return;

    fetch(`http://localhost:5000/get_teacher_courses/get_teacher_courses?teacher_id=${teacherId}`, {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) {
          // Convert backend courses [{course_id, course_name}] to your courses [{id, title}]
          const coursesFormatted = data.courses.map((c) => ({
            id: c.course_id,
            title: c.course_name,
          }));

          // Update the teacher's courses inside mockTeachers state
          setMockTeachers((prev) =>
            prev.map((t) =>
              t.id === parseInt(teacherId) ? { ...t, courses: coursesFormatted } : t
            )
          );
        } else {
          toast.error(data.error || "Failed to load courses");
        }
      })
      .catch(() => toast.error("Failed to load courses"));

    setSelectedTeacherId(teacherId);
  };

  // Your original handleRegister with backend call replacing localStorage
  const handleRegister = () => {
    if (!selectedTeacherId || !selectedCourseId) {
      toast.error("Please select both teacher and course");
      return;
    }

    // Find selected teacher and course from mockTeachers state
    const teacher = mockTeachers.find((t) => t.id === parseInt(selectedTeacherId));
    const course = teacher?.courses.find((c) => c.id === parseInt(selectedCourseId));

    if (!teacher || !course) {
      toast.error("Invalid teacher or course");
      return;
    }

    // Call backend register API
    fetch("http://localhost:5000/register_course/register_course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        teacher_id: selectedTeacherId,
        course_id: selectedCourseId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          toast.success(`✅ Registered for ${course.title} with ${teacher.name}`);

          // Refresh registered courses after success
          fetch("http://localhost:5000/get_registered_courses/get_registered_courses", {
            headers: { Authorization: token },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.courses) {
                const regCourses = data.courses.map((c) => ({
                  course: { id: c.course_id, title: c.course_name },
                  teacher: { id: null, name: c.teacher_name },
                }));
                setRegisteredCourses(regCourses);
              }
            });
        } else {
          toast.error(data.error || "Registration failed");
        }
      })
      .catch(() => toast.error("Registration failed"));
  };

  // Your original handleUnregister with backend call replacing localStorage
  const handleUnregister = (index) => {
    const course_id = registeredCourses[index].course.id;

    fetch("http://localhost:5000/unregister_course/unregister_course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ course_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          toast.success("❌ Course unregistered successfully");

          // Refresh registered courses after success
          fetch("http://localhost:5000/get_registered_courses/get_registered_courses", {
            headers: { Authorization: token },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.courses) {
                const regCourses = data.courses.map((c) => ({
                  course: { id: c.course_id, title: c.course_name },
                  teacher: { id: null, name: c.teacher_name },
                }));
                setRegisteredCourses(regCourses);
              }
            });
        } else {
          toast.error(data.error || "Unregistration failed");
        }
      })
      .catch(() => toast.error("Unregistration failed"));
  };

  // UI JSX is completely your original UI, unchanged, just uses our updated state `mockTeachers` and handlers above

  const selectedTeacher = mockTeachers.find(
    (t) => t.id === parseInt(selectedTeacherId)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className=" px-6 py-10 "
    >
      <ToastContainer />
      <div className=" flex flex-col items-center">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-2">Register Courses</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 italic">
            Select a teacher and course to register.
          </p>
        </div>

        <div className="w-full max-w-5xl bg-[#c0e8eb] dark:bg-[#0f5c61] p-10 md:p-14 rounded-xl shadow-xl">
          <div className="mb-6">
            <label className="block mb-2 text-lg font-semibold text-[#12474b] dark:text-[#c0e8eb]">
              Select a teacher:
            </label>
            <select
              className="w-full p-3 rounded border border-gray-400 text-[#12474b] dark:text-white dark:bg-[#0f5c61]"
              value={selectedTeacherId}
              onChange={(e) => {
                handleTeacherChange(e);
              }}
            >
              <option value="">Choose a teacher</option>
              {mockTeachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          {selectedTeacher && (
            <div className="mb-6">
              <label className="block mb-2 text-lg font-semibold text-[#12474b] dark:text-[#c0e8eb]">
                Select a course:
              </label>
              <select
                className="w-full p-3 rounded border border-gray-400 text-[#12474b] dark:text-white dark:bg-[#0f5c61]"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                <option value="">-- Choose a course --</option>
                {selectedTeacher.courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleRegister}
            className="w-full mt-2 px-6 py-2 bg-[#2cb1bc] hover:bg-[#1b9ba1] text-white rounded shadow-md transition-all duration-300"
          >
            Register
          </button>

          {registeredCourses.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#12474b] dark:text-[#c0e8eb]">
                Registered Courses
              </h2>
              {registeredCourses.map((entry, index) => (
                <div
                  key={index}
                  className="mb-6 bg-white dark:bg-[#144c4c] p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-[#12474b] dark:text-white">
                      {entry.course.title} <br />
                      <span className="text-sm font-normal">
                        with {entry.teacher.name}
                      </span>
                    </h3>
                    <button
                      onClick={() => handleUnregister(index)}
                      className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow-sm"
                    >
                      Unregister
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
