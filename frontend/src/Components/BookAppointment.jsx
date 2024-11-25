import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import bookImage from "./book.jpg";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [teachers, setTeachers] = useState([]);
  const [reason, setReason] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/users/teachers"
        );
        if (response.status === 200) {
          const uniqueTeachers = response.data.data.filter(
            (teacher, index, self) =>
              index === self.findIndex((t) => t._id === teacher._id)
          );
          setTeachers(uniqueTeachers);
        } else {
          throw new Error("Failed to fetch teachers");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setErrorMessage("Failed to fetch teachers");
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleTeacherSelection = (teacherName) => {
    setSelectedTeacher(teacherName);
  };

  const handleSlotSelection = (timeSlot) => {
    setSelectedSlot(timeSlot);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const resetForm = () => {
    setSelectedTeacher("");
    setSelectedSlot("");
    setSelectedDate(new Date());
    setReason("");
    setBookingStatus("");
    setErrorMessage("");
    setShowSuccessPopup(false);
  };

  const handleBookAppointment = async () => {
    setErrorMessage("");
    try {
      const formattedDate = new Date(selectedDate).toLocaleDateString();
      const token = localStorage.getItem("authToken");

      if (!selectedTeacher || !selectedSlot || !formattedDate) {
        setErrorMessage("Please fill in all fields.");
        return;
      }

      setIsButtonEnabled(false);

      const response = await axios.post(
        "http://localhost:4000/api/v1/appointments",
        {
          teacherName: selectedTeacher,
          date: formattedDate,
          time: selectedSlot,
          reason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setBookingStatus("Appointment booked successfully");
        setShowSuccessPopup(true);

        setTimeout(() => {
          resetForm();
          setIsButtonEnabled(true);
        }, 3000);
      } else {
        setErrorMessage("Failed to book an appointment. Please try again.");
        setIsButtonEnabled(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to book an appointment. Please try again.");
      setIsButtonEnabled(true);
    }
  };

  return (
    <div className="bg-blue-950 flex flex-col min-h-screen relative items-center justify-center">
      <button
        className="absolute bg-[#FF9503] text-white font-bold p-2 rounded-full top-5 right-20 transform hover:scale-105 transition-transform z-10"
        onClick={() => navigate("/StudentAppointments")}
      >
        My Appointments
      </button>
      <video
        src="bgvid.mp4"
        autoPlay="{true}"
        loop
        muted
        className="absolute w-[100%] max-h-full opacity-5"
      ></video>
      <div className="flex items-center justify-center mb-6">
        <img
          src={bookImage}
          alt="reminder"
          className="w-20 h-20 mx-4 rounded-lg mt-5"
        />
        <TypeAnimation
          sequence={[
            "Book an Appointment",
            1000,
            "Select your Teacher",
            1000,
            "",
            1000,
            "Book Appointments with Teacher",
            1000,
          ]}
          wrapper="span"
          speed={50}
          style={{
            fontSize: "2em",
            display: "inline-block",
            color: "white",
            marginTop: "1rem",
          }}
          repeat={Infinity}
        />
      </div>
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-xl mb-4">
        {isLoading ? (
          <p className="text-center text-blue-900 font-semibold">Loading...</p>
        ) : (
          <>
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2 text-blue-900">
                Choose Your Teacher
              </h2>
              <Slider {...sliderSettings}>
                {teachers.map((teacher) => (
                  <div key={teacher._id} className="text-center">
                    <img
                      src={teacher.photo}
                      alt={teacher.name}
                      className="mx-auto w-20 h-20 rounded-full mb-2"
                      onClick={() => handleTeacherSelection(teacher.name)}
                    />
                    <p
                      className={`text-blue-900 text-base cursor-pointer focus:text-[#FF9503] rounded-full ${
                        selectedTeacher === teacher.name ? "bg-[#FF9503]" : ""
                      }`}
                      onClick={() => handleTeacherSelection(teacher.name)}
                    >
                      {teacher.name}
                    </p>
                  </div>
                ))}
              </Slider>
            </div>
            <div className="mt-4">
              <h2 className="text-lg relative font-semibold mb-2 text-blue-900">
                Available Slots
              </h2>
              <div className="space-y-2 relative">
                {selectedTeacher &&
                  teachers
                    .find((teacher) => teacher.name === selectedTeacher)
                    ?.timeSlots.map((timeSlot) => (
                      <div
                        key={timeSlot}
                        className={`p-2 cursor-pointer border rounded ${
                          selectedSlot === timeSlot
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                        onClick={() => handleSlotSelection(timeSlot)}
                      >
                        {timeSlot}
                      </div>
                    ))}
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2 text-blue-900">
                Select Date and Time
              </h2>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="w-full relative"
              />
            </div>
            <div className="mt-4 relative">
              <h2 className="text-lg font-semibold mb-2 text-blue-900">
                Reason for Appointment
              </h2>
              <input
                type="text"
                value={reason}
                onChange={handleReasonChange}
                placeholder="Enter reason"
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mt-6">
              <button
                className={`w-full bg-blue-950 hover-bg-blue-700 relative text-white font-semibold py-2 rounded focus:outline-none focus:shadow-outline ${
                  !isButtonEnabled ? "cursor-not-allowed" : ""
                }`}
                onClick={handleBookAppointment}
                disabled={!isButtonEnabled}
              >
                {isButtonEnabled
                  ? "Book Appointment"
                  : "Booking Appointment..."}
              </button>
            </div>
            {errorMessage && (
              <p className="mt-4 text-center text-red-500 font-semibold">
                {errorMessage}
              </p>
            )}
          </>
        )}
        {showSuccessPopup && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
              <p className="text-green-500 mb-2 font-semibold">
                Appointment Request Sent
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-12"></div>
    </div>
  );
};

export default BookAppointment;
