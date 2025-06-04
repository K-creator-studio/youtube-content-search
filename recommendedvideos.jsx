import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const RecommendedVideos = ({ keywords = [], onReady, topVideo }) => {
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    // if (!keywords.length) return;
    // setLoading(true);

    // API request to fetch recommended videos
    const fetchRecommendedVideos = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/recommendations/recommendations?user_id=25&user_type=teacher`
        );
        const data = await response.json(); // Assuming the response is a JSON array of recommended videos
        if (data && data.recommendations) {
          setRecommended(data.recommendations); // Assuming 'recommendations' is the field containing recommended video details
        } else {
          setRecommended([]); // In case there is no data
        }
      } catch (error) {
        console.error("Error fetching recommended videos:", error);
        setRecommended([]); // Handle error gracefully
      } finally {
        setLoading(false);
        onReady?.(); // Notify when data is ready
      }
    };

    fetchRecommendedVideos();
  }, [keywords, onReady]); // Re-fetch when keywords change

  // if (!keywords.length) {
  //   return (
  //     <div className="flex flex-col items-center justify-center mt-10">
  //       <img
  //         src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
  //         alt="No Search"
  //         className="w-32 h-32 mb-4 opacity-70"
  //       />
  //       <p className="text-center text-base font-medium text-gray-600 dark:text-gray-300">
  //         No searches found.
  //       </p>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="text-center mt-10 animate-pulse">
        <p className="text-lg text-[#12474b] dark:text-[#c0e8eb]">
          Loading recommended videos...
        </p>
      </div>
    );
  }

  if (!recommended.length) {
    return (
      <div className="text-center mt-10">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          No videos found.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-10">
      {/* Top Video Based on Your Search */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-center text-[#12474b] dark:text-[#c0e8eb]">
          Top Video Based on Metrics
        </h3>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-[#d0f2f2] to-[#b8ebeb] dark:from-[#103f40] dark:to-[#16595e] p-6 rounded-xl shadow-xl flex items-center justify-start space-x-4"
        >
          {topVideo ? (
            <>
              <img
                src={topVideo.thumbnail}
                alt="Video Thumbnail"
                className="w-48 h-48 object-cover rounded-md"
              />
              <div className="text-left">
                <h4 className="text-xl font-semibold mb-2 text-[#0c3b3d] dark:text-[#c0e8eb]">
                  {topVideo.title}
                </h4>
                <p className="text-sm mb-4 text-[#0c3b3d] dark:text-gray-200">
                  {topVideo.description}
                </p>
                <a
                  href={topVideo.videoLink || topVideo.video_link}
                  className="text-blue-600 dark:text-blue-300 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Now
                </a>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              No top video available.
            </p>
          )}
        </motion.div>
      </div>

      {/* More Recommended Videos */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-center text-[#12474b] dark:text-[#c0e8eb]">
          More Recommended Videos
        </h3>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {recommended.length > 0 ? (
            recommended.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-[#e5fafa] dark:bg-[#12474b] border-l-4 border-[#1ca9a9] dark:border-[#77e3e3] p-4 rounded-lg shadow hover:shadow-xl hover:scale-[1.02] transition duration-300"
              >
                {/* Display the video thumbnail */}
                <img
                  src={video.thumbnail} // Use the actual video thumbnail URL from API
                  alt="Video Thumbnail"
                  className="w-48 h-48 object-cover rounded-md"
                />
                <h4 className="text-lg font-semibold mb-2 text-[#0c3b3d] dark:text-[#c0e8eb]">
                  {video.title} {/* Use video title */}
                </h4>
                <p className="text-sm mb-2 text-[#0c3b3d] dark:text-gray-300">
                  {video.description} {/* Use video description */}
                </p>
                <a
                  href={video.url} // Use the actual video URL from the API
                  className="text-blue-600 dark:text-blue-300 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Video
                </a>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-lg text-gray-600 dark:text-gray-300">
              No more recommended videos available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendedVideos;
