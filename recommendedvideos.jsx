// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// export default function RecommendedVideos({ searchHistory }) {
//   const [topKeywords, setTopKeywords] = useState([]);

//   useEffect(() => {
//     if (searchHistory.length > 5) {
//       setTopKeywords(searchHistory.slice(0, 5));
//     } else {
//       setTopKeywords(searchHistory);
//     }
//   }, [searchHistory]);

//   return (
//     <div className="my-1">
//       <p className="text-gray-600 dark:text-gray-300 text-left italic mb-5">
//         Based on your top {topKeywords.length} searches:
//       </p>

//       <motion.div
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         {topKeywords.map((keyword, index) => (
//           <motion.div
//             key={index}
//             className="p-6 bg-[#c0e8eb] dark:bg-[#0f5c61] rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300"
//             whileHover={{ rotate: 1 }}
//           >
//             <h3 className="text-lg font-bold mb-2">{keyword.search_query}</h3>
//             <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
//               Find the best videos for "{keyword.search_query}"
//             </p>
//             <button
//               onClick={() =>
//                 alert(`🎥 Pretending to watch video for "${keyword.search_query}"`)
//               }
//               className="px-4 py-2 bg-[#2cb1bc] hover:bg-[#1b9ba1] text-white rounded shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
//             >
//               🎥 Watch Video
//             </button>
//           </motion.div>
//         ))}
//       </motion.div>
//     </div>
//   );
// }
 
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// export default function RecommendedVideos({ searchHistory }) {
//   const [topKeywords, setTopKeywords] = useState([]);

//   useEffect(() => {
//     if (searchHistory.length > 5) {
//       setTopKeywords(searchHistory.slice(0, 5));
//     } else {
//       setTopKeywords(searchHistory);
//     }
//   }, [searchHistory]);

//   return (
//     <div className="my-1">
//       <p className="text-gray-600 dark:text-gray-300 text-left italic mb-5">
//         Based on your top {topKeywords.length} searches:
//       </p>

//       <motion.div
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         {topKeywords.map((keyword, index) => (
//           <motion.div
//             key={index}
//             className="p-6 bg-[#c0e8eb] dark:bg-[#0f5c61] rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300"
//             whileHover={{ rotate: 1 }}
//           >
//             <img
//               src={keyword.thumbnail}
//               alt={keyword.title}
//               className="rounded-md mb-4 w-full h-48 object-cover"
//               onError={(e) => { e.target.src = "/placeholder.png"; }} // fallback image if needed
//             />
//             <h3 className="text-lg font-bold mb-2">{keyword.title}</h3>
//             <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
//               {keyword.description && keyword.description.length > 100
//                 ? keyword.description.substring(0, 100) + "..."
//                 : keyword.description || ""}
//             </p>
//             <button
//               onClick={() =>
//                 alert(`🎥 Pretending to watch video for "${keyword.search_query}"`)
//               }
//               className="px-4 py-2 bg-[#2cb1bc] hover:bg-[#1b9ba1] text-white rounded shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
//             >
//             <a
//               href={keyword.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="px-4 py-2 bg-[#2cb1bc] hover:bg-[#1b9ba1] text-white rounded shadow-md hover:shadow-lg text-center"
//             > 
//               🎥 Watch Video
//             </a>  
//             </button>
//           </motion.div>
//         ))}
//       </motion.div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// export default function RecommendedVideos({ recommendedVideos }) {
//   const [topVideos, setTopVideos] = useState([]);

//   useEffect(() => {
//     if (recommendedVideos && recommendedVideos.length > 5) {
//       setTopVideos(recommendedVideos.slice(0, 5));
//     } else {
//       setTopVideos(recommendedVideos || []);
//     }
//   }, [recommendedVideos]);

//   return (
//     <div className="my-1">
//       <p className="text-gray-600 dark:text-gray-300 text-left italic mb-5">
//         Based on your recent activity:
//       </p>

//       <motion.div
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         {topVideos.map((video, index) => (
//           <motion.div
//             key={index}
//             className="p-6 bg-[#c0e8eb] dark:bg-[#0f5c61] rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300"
//             whileHover={{ rotate: 1 }}
//           >
//             <img
//               src={video.thumbnail}
//               alt={video.title}
//               className="rounded-md mb-4 w-full h-48 object-cover"
//               onError={(e) => {
//                 e.target.src = "/placeholder.png"; // fallback image
//               }}
//             />
//             <h3 className="text-lg font-bold mb-2 text-center">{video.title}</h3>
//             <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 text-center">
//               {video.description?.length > 100
//                 ? video.description.substring(0, 100) + "..."
//                 : video.description || ""}
//             </p>
//             <a
//               href={video.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="px-4 py-2 bg-[#2cb1bc] hover:bg-[#1b9ba1] text-white rounded shadow-md hover:shadow-lg text-center"
//             >
//               🎥 Watch Video
//             </a>
//           </motion.div>
//         ))}
//       </motion.div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function RecommendedVideos({ recommendedVideos }) {
  const [topVideos, setTopVideos] = useState([]);

  useEffect(() => {
    const videos = recommendedVideos || [];
    setTopVideos(videos.length > 5 ? videos.slice(0, 5) : videos);
  }, [recommendedVideos]);

  return (
    <div className="my-1">
      <p className="text-gray-600 dark:text-gray-300 text-left italic mb-5">
        Based on your recent activity:
      </p>

      {topVideos.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No recommendations available yet.
        </p>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {topVideos.map((video) => (
            <motion.div
              key={video.id} // Use a unique ID from video data
              className="p-6 bg-[#c0e8eb] dark:bg-[#0f5c61] rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300"
              whileHover={{ rotate: 1 }}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="rounded-md mb-4 w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
              <h3 className="text-lg font-bold mb-2 text-center">{video.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 text-center">
                {video.description?.length > 100
                  ? `${video.description.substring(0, 97)}...`
                  : video.description || "No description available"}
              </p>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#2cb1bc] hover:bg-[#1b9ba1] text-white rounded shadow-md hover:shadow-lg text-center w-full transition-colors duration-300"
              >
                🎥 Watch Video
              </a>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}