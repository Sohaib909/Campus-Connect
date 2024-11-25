import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import TeacherFeatures from "./TeacherFeatures";
import Lottie from "lottie-react";
import FirstAnimation from "../Animation/FirstAnimation.json";
import Home1 from "../Animation/Home1.json";

const TeacherHomePage = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="bg-blue-950 w-full flex flex-col relative">
      <video
        src="bgvid.mp4"
        autoPlay="{true}"
        loop
        muted
        className="absolute w-[100%] opacity-5"
      ></video>
      <div className="max-w-6xl mx-auto p-8 flex flex-col items-center relative z-10">
        <div className="flex flex-col md:flex-row">
          {/* Left Portion */}
          <div className="md:w-1/2 text-white md:p-8">
            <br />
            <br />
            <br />
            <br />
            <h2 className="font-extrabold italic mb-4 text-4xl">
              CONNECT WITH EASE
            </h2>
            <br />
            <p style={{ textAlign: "justify", fontSize: "18px" }}>
              Campus connect is the web-based university app developed as an
              essential tool for students, teachers, and societies. Its purpose
              is to enhance communication, streamline processes, and provide a
              convenient platform for students and faculty members to stay
              connected.
            </p>
            <br />

            <div className="flex flex-row md:flex-col justify-between items-center md:justify-start md:items-start">
              <div>
                <Link
                  to="/CampusNews"
                  className="bg-white text-blue-900 rounded-full py-2 px-4 text-center transition duration-300 ease-in-out hover-bg-blue-900 hover-text-white"
                >
                  Read More
                </Link>
              </div>
              <Lottie
                className="z-50  h-36 w-36  "
                animationData={FirstAnimation}
              />
            </div>
          </div>

          {/* Right Portion */}
          <div className="md:w-1/2 relative mt-8">
            <div className="my-2 w-full shadow-2xl rounded-lg overflow-hidden  top-0 right-0">
              {/* Carousel */}
              <Carousel
                showThumbs={false}
                autoPlay={true}
                infiniteLoop={true}
                interval={2000}
                stopOnHover={false}
                showStatus={false}
                className="w-full bg-gradient-to-r from-blue-700 to-white"
              >
                <div>
                  <img
                    src="pic.png"
                    alt="Slider 1"
                    style={{
                      width: "100%",
                      height: "450px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <img
                    src="pic1.png"
                    alt="Slider 2"
                    style={{
                      width: "100%",
                      height: "450px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <img
                    src="pic.png"
                    alt="Slider 3"
                    style={{
                      width: "100%",
                      height: "450px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <img
                    src="pic1.png"
                    alt="Slider 4"
                    style={{
                      width: "100%",
                      height: "450px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <div>
        <TeacherFeatures />
      </div>
      <section className="text-white">
        <div className="container flex flex-col-reverse mx-auto lg:flex-row">
          <div className="flex flex-col px-6 py-8 space-y-6 rounded-sm sm:p-8 lg:p-12 lg:w-1/2 xl:w-2/5 dark:bg-violet-400 dark:text-gray-900">
            <div className="flex space-x-2 sm:space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                ></path>
              </svg>
              <div className="space-y-2">
                <p className="text-lg font-medium leadi">Campus Activities</p>
                <p className="leadi">
                  Praesentium ea et neque distinctio quas eius repudiandae
                  quaerat obcaecati voluptatem similique!
                </p>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                ></path>
              </svg>
              <div className="space-y-2">
                <p className="text-lg font-medium leadi">
                  Connect with teachers
                </p>
                <p className="leadi">
                  Praesentium ea et neque distinctio quas eius repudiandae
                  quaerat obcaecati voluptatem similique!
                </p>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                ></path>
              </svg>
              <div className="space-y-2">
                <p className="text-lg font-medium leadi">
                  Societies are waiting for you
                </p>
                <p className="leadi">
                  Praesentium ea et neque distinctio quas eius repudiandae
                  quaerat obcaecati voluptatem similique!
                </p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 xl:w-3/5 dark:bg-gray-800">
            <div className="flex items-center justify-center p-4 md:p-8 lg:p-12">
              <Lottie
                className="rounded-lg shadow-lg dark:bg-gray-500 aspect-video sm:min-h-96"
                animationData={Home1}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeacherHomePage;
