import React, { useState, useEffect } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import axios from "axios";
import moment from "moment";
import reminderImage from "./reminder.png";
import Lottie from "lottie-react";
import LectureAnimation from "../Animation/LectureAnimation.json";
import ReminderLogo from "../Animation/LecRemin2.json";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";

const LectureReminder = () => {
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [reminderMessage, setReminderMessage] = useState("");
  const [isDaily, setIsDaily] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDateTime) {
      alert("Please select a valid date and time for the reminder.");
      return;
    }

    const formattedDateTime =
      moment(selectedDateTime).format("MM-DD-YYYY HH:mm");
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("User is not logged in. Please log in first.");
      return;
    }

    setIsLoading(true);

    const newReminder = {
      roomNo: selectedRoom,
      reminderMsg: reminderMessage,
      remindAt: formattedDateTime,
      isDaily: isDaily,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/reminders/add",
        newReminder,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("Reminder created successfully:", response.data);
      setShowSuccessPopup(true);

      setSelectedRoom("");
      setSelectedDateTime(null);
      setReminderMessage("");
      setIsDaily(false);

      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-950 min-h-screen relative">
      <button
        className="absolute bg-[#FF9503] text-white font-bold p-2 rounded-full top-5 right-10 transform hover:scale-105 transition-transform z-10"
        onClick={() => navigate("/StudentReminders")}
      >
        My Reminders
      </button>
      <video
        src="bgvid.mp4"
        autoPlay={true}
        loop
        muted
        className="absolute w-[100%] opacity-5"
      ></video>
      <div className="max-w-6xl mx-auto p-8 md:p-16 flex flex-col md:flex-row justify-center items-center relative z-10">
        <div className="w-full text-center">
          <div className="flex items-center">
            <span>
              <Lottie
                className="h-40 w-56 mx-auto mt-4 rounded-lg"
                animationData={ReminderLogo}
              />
            </span>
            <h2 className="font-bold mb-4 text-white text-4xl relative z-10">
              Lecture Reminder
            </h2>
          </div>

          <TypeAnimation
            sequence={[
              "Set your Lecture Reminder",
              1000,
              "Set your Lecture Reminder",
              1000,
              "Set your Lecture Reminder",
              1000,
              "Set your Lecture Reminder",
              1000,
            ]}
            wrapper="span"
            speed={50}
            style={{ fontSize: "5em", display: "inline-block", color: "white" }}
            repeat={Infinity}
          />
        </div>

        <div className="mx-4 bg-white flex justify-center items-center rounded-lg shadow-md p-4 w-full md:w-1/2 lg-w-1/3 h-[460px]">
          <form onSubmit={handleFormSubmit}>
            <h2 className="text-blue font-bold text-2xl mb-4 text-center">
              Set Reminder
            </h2>
            <div className="mb-4">
              <label className="block text-blue font-bold">Room Number:</label>
              <input
                type="text"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                placeholder="Enter room number"
                className="block w-full p-2 rounded bg-gray-100 text-gray-900"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-blue font-bold">
                Select Date and Time:
              </label>
              <Datetime
                value={selectedDateTime}
                onChange={(date) => setSelectedDateTime(date)}
                isValidDate={(current) => current.isAfter(Datetime.moment())}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-blue font-bold">
                Reminder Message:
              </label>
              <input
                type="text"
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                placeholder="Enter your reminder message"
                className="block w-full p-2 rounded bg-gray-100 text-gray-900"
                required
              />
            </div>
            <div className="mb-4"></div>
            <button
              type="submit"
              className="mt-4 bg-blue-900 hover:bg-blue-700 text-white font-bold py-1 px-6 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              {isLoading ? "Setting Reminder..." : "Create Reminder"}
            </button>
          </form>
        </div>
      </div>
      {showSuccessPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md z-50">
            <p className="text-green-500 mb-2 font-bold">
              Reminder created successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LectureReminder;
