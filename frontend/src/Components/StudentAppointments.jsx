import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentAppointments = () => {
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    axios
      .get("http://localhost:4000/api/v1/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          const formattedAppointments = response.data.data.appointments.map(
            (appointment) => ({
              ...appointment,
              date: new Date(appointment.date).toLocaleDateString(),
            })
          );
          setApprovedAppointments(formattedAppointments);
        } else {
          console.error("Failed to fetch approved appointments");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="bg-blue-950 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-center mt-16 text-white">
        Your Appointments
      </h1>
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-4xl mb-4">
        <center>
          {" "}
          <h2 className="text-lg font-bold mb-2">Your Appointments</h2>
        </center>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {approvedAppointments.map((appointment) => (
              <div key={appointment._id} className="border rounded p-4">
                <img src={appointment.teacherInfo.photo} alt={appointment.teacherInfo.name} className="mt-2 w-20 h-20 rounded-full" />
                <p>
                  <strong>Teaher:</strong>{" "}
                  {appointment.studentInfo
                    ? appointment.teacherInfo.name
                    : "N/A"}
                </p>
                <p>
                  <strong>Department:</strong>{" "}
                  {appointment.studentInfo
                    ? appointment.studentInfo.department
                    : "N/A"}
                </p>
                <p>
                  <strong>Date:</strong> {appointment.date}
                </p>
                <p>
                  <strong>Time:</strong> {appointment.time}
                </p>
                <p>
                  <strong>Reason:</strong> {appointment.reason}
                </p>
                <p>
                  <strong>Status:</strong> {appointment.status}
                </p>
               
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAppointments;
