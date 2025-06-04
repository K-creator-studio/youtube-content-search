import React from "react";
import { Bar } from "react-chartjs-2";


// ✅ Fix: Register required Chart.js modules
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const Analytics = ({ courses = [], favorites = [] }) => {
  const chartData = {
    labels: ["Courses", "Lectures", "Watch Time (min)", "Favorites"],
    datasets: [
      {
        label: "Dashboard Stats",
        backgroundColor: ["#2cb1bc", "#1b9ba1", "#179191", "#106d6d"],
        data: [
          courses.length,
          courses.reduce((acc, curr) => acc + curr.lectures.length, 0),
          courses
            .flatMap((c) => c.lectures)
            .reduce((acc, curr) => acc + parseInt(curr.duration), 0),
          favorites.length,
        ],
      },
    ],
  };

  return (
    <div className="px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-6">
        Analytics Overview
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="bg-[#e5fafa] p-6 rounded-xl shadow hover:shadow-md">
          <p className="text-lg font-medium">Total Courses</p>
          <h2 className="text-3xl font-bold mt-2">{courses.length}</h2>
        </div>
        <div className="bg-[#e5fafa] p-6 rounded-xl shadow hover:shadow-md">
          <p className="text-lg font-medium">Total Lectures</p>
          <h2 className="text-3xl font-bold mt-2">
            {courses.reduce((acc, curr) => acc + curr.lectures.length, 0)}
          </h2>
        </div>
        <div className="bg-[#e5fafa] p-6 rounded-xl shadow hover:shadow-md">
          <p className="text-lg font-medium">Watch Time</p>
          <h2 className="text-3xl font-bold mt-2">
            {courses
              .flatMap((c) => c.lectures)
              .reduce((acc, curr) => acc + parseInt(curr.duration), 0)}{" "}
            min
          </h2>
        </div>
        <div className="bg-[#e5fafa] p-6 rounded-xl shadow hover:shadow-md">
          <p className="text-lg font-medium">Favorites</p>
          <h2 className="text-3xl font-bold mt-2">{favorites.length}</h2>
        </div>
      </div>

      <div className="mt-12 max-w-4xl mx-auto">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
          }}
        />
      </div>
    </div>
  );
};

export default Analytics;
