import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addNotification } from "./notificationSlice.js";

const ManageAppointments = () => {
  const [teacherAppointments, setTeacherAppointments] = useState([]);
  const [showApprovedPopup, setShowApprovedPopup] = useState(false);
  const [showRejectedPopup, setShowRejectedPopup] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTeacherAppointments = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get(
          "http://localhost:4000/api/v1/appointments/manageAppointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          const formattedAppointments = response.data.data.appointments
            .filter((appointment) => appointment.status === "pending")
            .map((appointment) => ({
              ...appointment,
              date: new Date(appointment.date).toLocaleDateString(),
            }));

          setTeacherAppointments(formattedAppointments);
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTeacherAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, status) => {
    const appointment = teacherAppointments.find(
      (apt) => apt._id === appointmentId
    );

    if (!appointment) {
      console.error("Appointment not found");
      return;
    }

    if (
      appointment.status === "approved" ||
      appointment.status === "rejected"
    ) {
      alert("This appointment status cannot be changed.");
      return;
    }

    const studentId = appointment.studentInfo
      ? appointment.studentInfo._id
      : null;

    if (!studentId) {
      console.error("Student not found");
      return;
    }

    const teacherName = appointment.teacherInfo
      ? appointment.teacherInfo.name
      : "N/A";

    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `http://localhost:4000/api/v1/appointments/${appointmentId}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setTeacherAppointments((prevAppointments) => {
          const updatedAppointments = prevAppointments.map((apt) => {
            if (apt._id === appointmentId) {
              return { ...apt, status };
            }
            return apt;
          });
          return updatedAppointments.filter((apt) => apt.status === "pending");
        });

        if (status === "approved") {
          setShowApprovedPopup(true);
          setTimeout(() => {
            setShowApprovedPopup(false);
          }, 3000);

          const studentNotification = {
            type: "Appointment Approved",
            message: `${teacherName} approved your appointment on ${new Date().toLocaleString()}`,
            recipient: studentId,
            appointmentId,
          };
          dispatch(addNotification(studentNotification));
        } else if (status === "rejected") {
          setShowRejectedPopup(true);
          setTimeout(() => {
            setShowRejectedPopup(false);
          }, 3000);

          const studentNotification = {
            type: "Appointment Rejected",
            message: `${teacherName} rejected your appointment on ${new Date().toLocaleString()}`,
            recipient: studentId,
            appointmentId,
          };
          dispatch(addNotification(studentNotification));
        }
      } else {
        console.error("Failed to change appointment status");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-blue-950 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-center mt-16 text-white">
        Manage Appointments
      </h1>
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-4xl mb-4">
        <center>
          <h2 className="text-lg font-bold mb-2">Appointment Requests</h2>
        </center>
        {teacherAppointments.length === 0 ? (
          <p>No new requests</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {teacherAppointments.map((appointment) => {
              const studentName = appointment.studentInfo
                ? appointment.studentInfo.name
                : "N/A";
              return (
                <div key={appointment._id} className="border rounded p-4">
                  <img src={appointment.studentInfo.photo} alt={appointment.studentInfo.name} className="mt-2 w-20 h-20 rounded-full" />
                  <p>
                    <strong>Student:</strong> {studentName}
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
                  <div className="mt-2">
                    <button
                      className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover-bg-green-700"
                      onClick={() =>
                        handleStatusChange(appointment._id, "approved")
                      }
                      disabled={
                        appointment.status === "approved" ||
                        appointment.status === "rejected"
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover-bg-red-700 ml-2"
                      onClick={() =>
                        handleStatusChange(appointment._id, "rejected")
                      }
                      disabled={
                        appointment.status === "approved" ||
                        appointment.status === "rejected"
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showApprovedPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="text-green-500 mb-2 font-semibold">
              Appointment Approved Successfully
            </p>
          </div>
        </div>
      )}

      {showRejectedPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="text-red-500 mb-2 font-semibold">
              Appointment Rejected
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;
