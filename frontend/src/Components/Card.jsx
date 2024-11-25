import React from "react";
import { Link } from "react-router-dom";

const imageUrls = [
  "/pic.png",
  "/card2.jpg",
  "/ss1.jpg",
  "/pic.png",
  "/card9.jpg",
  "/card7.jpg",
];

const paragraphTexts = [
  <div>
    <b>Campus Connect</b> is a dynamic platform designed to foster connections
    and collaboration within the academic community. It serves as a bridge.{" "}
  </div>,
  <div>
    <b>Course Material</b> Our website offers a wide range of courses to meet
    your learning needs.Our website offers a wide range of courses to meet your
    learning needs.
  </div>,
  <div>
    <b>Lecture Reminder</b> Lecture reminders are especially useful in the
    fast-paced world Society registration is a crucial step our platform
    simplifies the process.
  </div>,
  <div>
    <b>Campus News</b> Get ready to immerse yourself in a world of exciting
    campus events! Our website offers a wide range of courses to meet your
    learning needs.
  </div>,
  <div>
    <b>Societies</b> Society registration is a crucial step our platform
    simplifies the process. Lecture reminders are especially useful in the
    fast-world.
  </div>,
  <div>
    <b>Book Appointment</b> Booking an appointment with us is a hassle-free
    process designed to meet your needs.Get ready to immerse yourself in a world
    of exciting campus events!
  </div>,
];

const cardLinks = [
  "/HomePage",
  "/StudentFolder",
  "/LectureReminder",
  "/CampusNews",
  "/Societies",
  "/BookAppointment",
];

function Card() {
  return (
    <div className="container mx-auto bg-blue-950">
      <div className="flex flex-wrap justify-center">
        {Array(3)
          .fill()
          .map((_, index) => (
            <Link to={cardLinks[index]} key={index}>
              <div className="hover:shadow-md transition-transform transform hover:-translate-y-8 cursor-pointer hover:scale-105 bg-white max-w-sm rounded overflow-hidden shadow-lg m-4">
                <img
                  src={process.env.PUBLIC_URL + imageUrls[index]}
                  alt={`Card ${index + 1}`}
                  className="w-full"
                />
                <div className="px-6 py-4">
                  <p className="text-gray-700 text-base">
                    {paragraphTexts[index]}
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </div>
      <div className="flex flex-wrap justify-center">
        {Array(3)
          .fill()
          .map((_, index) => (
            <Link to={cardLinks[index + 3]} key={index}>
              <div className="hover:shadow-md transition-transform transform hover:-translate-y-8 cursor-pointer hover:scale-105 bg-white max-w-sm rounded overflow-hidden shadow-lg m-4">
                <img
                  src={process.env.PUBLIC_URL + imageUrls[index + 3]}
                  alt={`Card ${index + 4}`}
                  className="w-full"
                />
                <div className="px-6 py-4">
                  <p className="text-gray-700 text-base">
                    {paragraphTexts[index + 3]}
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Card;
