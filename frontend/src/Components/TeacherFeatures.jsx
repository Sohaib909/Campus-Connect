import React from "react";
import { MdLibraryBooks } from "react-icons/md";
import { Link } from "react-router-dom";

const TeacherFeatures = () => {
  return (
    <div className=" px-4 text-white z-10 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <br />
      <br />
      <center>
        <h2 className="font-extrabold italic mb-4 text-4xl">FEATURES</h2>
      </center>
      <br />
      <br />
      <div className="gap-8 flex-wrap flex justify-center items-center">
        <div className="max-w-md sm:mx-auto sm:text-center">
          <div className="flex items-center bg-[#FF9503] justify-center hover:bg-orange-700 z-20 w-16 h-16 mb-4 rounded-full  sm:mx-auto sm:w-24 sm:h-24">
            <Link to={"/Folder"}>
              <MdLibraryBooks size={60} className="bg-[#FF9503] rounded-full" />
            </Link>
          </div>
          <h6 className="mb-3 text-xl font-bold leading-5">Course Material</h6>
          <p className="mb-3 text-sm ">
            Explore your courses: Click here to access a treasure trove of
            educational materials and delve into the enriching world of your
            studies.
          </p>
        </div>
        <div className="max-w-md sm:mx-auto sm:text-center">
          <div className="flex items-center justify-center hover:bg-orange-700 w-16 h-16 mb-4 rounded-full  sm:mx-auto sm:w-24 sm:h-24">
            <svg
              className="w-12 h-12 text-deep-purple-accent-400 sm:w-16 sm:h-16"
              stroke="currentColor"
              viewBox="0 0 52 52"
            >
              <polygon
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                points="29 13 14 29 25 29 23 39 38 23 27 23"
              />
            </svg>

            <div className="flex items-center bg-[#FF9503] justify-center hover:bg-orange-700 w-16 h-16 px-4 rounded-full z-10 sm:mx-auto sm:w-24 sm:h-24">
              <Link to={"/CampusNews"}>
                <MdLibraryBooks
                  size={60}
                  className="bg-[#FF9503] rounded-full"
                />
              </Link>
            </div>
          </div>
          <h6 className="mb-3 text-xl font-bold leading-5"> Campus News</h6>
          <p className="mb-3 text-sm ">
            A slice of heaven. O for awesome, this chocka full cuzzie is as
            rip-off as a cracker. Meanwhile, in behind the bicycle shed,
            Hercules Morse, as big as a horse and Mrs Falani were up to no good
            with a bunch of crook pikelets.
          </p>
        </div>
        <div className="max-w-md sm:mx-auto sm:text-center">
          <div className="flex items-center justify-center hover:bg-orange-700 w-16 h-16 mb-4 rounded-full sm:mx-auto sm:w-24 sm:h-24">
            <svg
              className="w-12 h-12 text-deep-purple-accent-400 sm:w-16 sm:h-16"
              stroke="currentColor"
              viewBox="0 0 52 52"
            >
              <polygon
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                points="29 13 14 29 25 29 23 39 38 23 27 23"
              />
            </svg>
            <div className="flex items-center bg-[#FF9503] z-10 justify-center hover:bg-orange-700 w-16 h-16 px-4 rounded-full   sm:mx-auto sm:w-24 sm:h-24">
              <Link to={"/AppointmentsPage"}>
                <MdLibraryBooks
                  size={60}
                  className="bg-[#FF9503] rounded-full"
                />
              </Link>
            </div>
          </div>
          <h6 className="mb-3 text-xl font-bold leading-5">Appointments</h6>
          <p className="mb-3 text-sm ">
            Disrupt inspire and think tank, social entrepreneur but preliminary
            thinking think tank compelling. Inspiring, invest synergy capacity
            building, white paper; silo, unprecedented challenge B-corp
            problem-solvers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherFeatures;
