import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Doughnut, Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faChalkboardTeacher,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import StudentForm from "./StudentForm";
import TeacherForm from "./TeacherForm";
import SocietyForm from "./SocietyForm";
import "chart.js/auto";

const fetchData = async (url, setDataCallback) => {
  try {
    const response = await axios.get(url);
    setDataCallback(response.data.count);
    return response.data.count;
  } catch (error) {
    console.error("Error fetching data:", error);
    return 0;
  }
};

const updateChartData = (prevData, counts) => ({
  ...prevData,
  datasets: [
    {
      ...prevData.datasets[0],
      data: counts,
      backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      borderColor: ["#ffffff", "#ffffff", "#ffffff"],
    },
  ],
});

const AdminDashboard = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [societyCount, setSocietyCount] = useState(0);

  const [userUsageData, setUserUsageData] = useState({
    labels: ["Teachers", "Students", "Societies"],
    datasets: [
      {
        label: "User Usage",
        data: [0, 0, 0],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        borderColor: ["#ffffff", "#ffffff", "#ffffff"],
        borderWidth: 1,
      },
    ],
  });

  const handleFormClick = (formName) => {
    setActiveForm(formName);
  };

  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      const studentCount = await fetchData(
        "http://localhost:4000/api/v1/admin/manageStudentsCount",
        setStudentCount
      );
      const teacherCount = await fetchData(
        "http://localhost:4000/api/v1/admin/manageTeachersCount",
        setTeacherCount
      );
      const societyCount = await fetchData(
        "http://localhost:4000/api/v1/admin/manageSocietiesCount",
        setSocietyCount
      );

      setUserUsageData((prevData) =>
        updateChartData(prevData, [teacherCount, studentCount, societyCount])
      ); // Reorder counts as needed
    };

    fetchDataAndUpdate();
  }, []);

  const renderForm = () => {
    if (activeForm === "student") return <StudentForm />;
    if (activeForm === "teacher") return <TeacherForm />;
    if (activeForm === "society") return <SocietyForm />;
    return null;
  };

  const renderCountLink = (formName, count, label, icon) => (
    <Link key={formName} onClick={() => handleFormClick(formName)} to="">
      <div className="bg-white p-4 text-black rounded-lg text-center bg-gradient-to-r from-blue-900 to-white text-white">
        <h3 className="text-2xl font-semibold mb-2 ">
          <FontAwesomeIcon icon={icon} className="mr-2 text-white" />
          {count}
        </h3>
        <p>{label}</p>
      </div>
    </Link>
  );

  const renderPieChart = () => {
    if (
      activeForm === "student" ||
      activeForm === "teacher" ||
      activeForm === "society"
    ) {
      return null;
    }

    return (
      <div
        className="mt-10 mb-20 text-white"
        style={{ width: "500px", height: "500px" }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">User Stats</h2>
        <Doughnut
          data={userUsageData}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
            layout: {
              padding: {
                top: 5,
                bottom: 5,
              },
            },
            elements: {
              arc: {
                borderWidth: 0,
              },
            },
            cutoutPercentage: 0,
          }}
        />
      </div>
    );
  };

  const renderBarChart = () => {
    if (
      activeForm === "student" ||
      activeForm === "teacher" ||
      activeForm === "society"
    ) {
      return null; // Don't render the chart on these forms
    }

    const barChartData = {
      labels: ["Teachers", "Students", "Societies"], // Reorder labels as needed
      datasets: [
        {
          label: "User Usage",
          data: [teacherCount, studentCount, societyCount], // Reorder counts as needed
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Change these colors for the bar chart
          borderColor: ["#ffffff", "#ffffff", "#ffffff"], // Change these colors for the bar chart
          borderWidth: 1,
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: "#ffffff",
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "#ffffff",
          },
        },
        y: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "#ffffff",
          },
        },
      },
    };

    return (
      <div
        className="chart-container mt-10 mb-20 text-white"
        style={{ width: "500px", height: "300px" }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">User Usage</h2>
        <Bar data={barChartData} options={options} />
      </div>
    );
  };

  return (
    <div className="flex h-full bg-blue-950 text-white">
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-white">
          {renderCountLink("student", studentCount, "Students", faUser)}
          {renderCountLink(
            "teacher",
            teacherCount,
            "Teachers",
            faChalkboardTeacher
          )}
          {renderCountLink("society", societyCount, "Societies", faUsers)}
        </div>

        <div className="flex justify-between">
          {renderBarChart()}
          {renderPieChart()}
        </div>

        <div className="w-full">{renderForm()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
