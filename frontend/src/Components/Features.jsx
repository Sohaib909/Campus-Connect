import React from "react";
import { MdLibraryBooks } from "react-icons/md";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <div className=" px-4 text-white z-10 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      {/* <video src="bgvid.mp4"
            autoplay="{true}" loop muted
            className="absolute w-[100%] opacity-10
              ">
        </video> */}

      {/* <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
          <div>
            <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
              Brand new
            </p>
          </div>
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight  sm:text-4xl md:mx-auto">
            <span className="relative inline-block">
           
              <span className="relative">The quick, brown fox jumps over a lazy dog
</span>
            </span>{' '}
          </h2>
         
        </div> */}
      <br />
      <br />
      <center>
        <h2 className="font-extrabold italic mb-4 text-4xl">FEATURES</h2>
      </center>
      <br />
      <br />
      <div className="gap-8 flex-wrap flex justify-center items-center">
        <div className="max-w-md sm:mx-auto sm:text-center">
          <div className="flex items-center bg-[#FF9503] justify-center hover:bg-orange-700 w-16 h-16 mb-4 rounded-full  sm:mx-auto sm:w-24 sm:h-24">
            <Link to={"/StudentFolder"}>
              <MdLibraryBooks size={60} className="bg-[#FF9503] rounded-full" />
            </Link>
          </div>
          <h6 className="mb-3 text-xl font-bold leading-5">Course Material</h6>
          {/* <p className="mb-3 text-sm ">
            Explore your courses: Click here to access a treasure trove of
            educational materials and delve into the enriching world of your
            studies.
          </p> */}
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
            <div className="flex items-center bg-[#FF9503] justify-center hover:bg-orange-700 w-16 h-16 px-4 rounded-full   sm:mx-auto sm:w-24 sm:h-24">
              <Link to={"/LectureReminder"}>
                <MdLibraryBooks
                  size={60}
                  className="bg-[#FF9503] rounded-full"
                />
              </Link>
            </div>
          </div>
          <h6 className="mb-3 text-xl font-bold leading-5">Lecture Reminder</h6>
          {/* <p className="mb-3 text-sm ">
            Rough pomfret lemon shark plownose chimaera southern sandfish
            kokanee northern sea robin Antarctic cod. Yellow-and-black triplefin
            gulper South American Lungfish mahi-mahi, butterflyfish glass
            catfish soapfish ling gray mullet!
          </p> */}
        </div>
        <div className="max-w-md sm:mx-auto sm:text-center">
          <div className="flex items-center  justify-center w-16 h-16 mb-4 rounded-full  sm:mx-auto sm:w-24 sm:h-24">
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
            <div className="flex items-center bg-[#FF9503] justify-center hover:bg-orange-700 w-16 h-16 px-4 rounded-full   sm:mx-auto sm:w-24 sm:h-24">
              <Link to={"/CampusNews"}>
                <MdLibraryBooks
                  size={60}
                  className="bg-[#FF9503] rounded-full"
                />
              </Link>
            </div>
          </div>
          <h6 className="mb-3 text-xl font-bold leading-5"> Campus News</h6>
          {/* <p className="mb-3 text-sm ">
            A slice of heaven. O for awesome, this chocka full cuzzie is as
            rip-off as a cracker. Meanwhile, in behind the bicycle shed,
            Hercules Morse, as big as a horse and Mrs Falani were up to no good
            with a bunch of crook pikelets.
          </p> */}
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
            <div className="flex items-center bg-[#FF9503] justify-center hover:bg-orange-700 w-16 h-16 px-4 rounded-full   sm:mx-auto sm:w-24 sm:h-24">
              <Link to={"/SocietyRegistration"}>
                <MdLibraryBooks
                  size={60}
                  className="bg-[#FF9503] rounded-full"
                />
              </Link>
            </div>
          </div>
          <h6 className="mb-3 text-xl font-bold leading-5">
            Society Registration
          </h6>
          {/* <p className="mb-3 text-sm ">
            Disrupt inspire and think tank, social entrepreneur but preliminary
            thinking think tank compelling. Inspiring, invest synergy capacity
            building, white paper; silo, unprecedented challenge B-corp
            problem-solvers.
          </p> */}
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
            <div className="flex items-center bg-[#FF9503] justify-center hover:bg-orange-700 w-16 h-16 px-4 rounded-full   sm:mx-auto sm:w-24 sm:h-24">
              <Link to={"/BookAppointment"}>
                <MdLibraryBooks
                  size={60}
                  className="bg-[#FF9503] rounded-full"
                />
              </Link>
            </div>
          </div>
          <h6 className="mb-3 text-xl font-bold leading-5">Book Appointment</h6>
          {/* <p className="mb-3 text-sm ">
            Disrupt inspire and think tank, social entrepreneur but preliminary
            thinking think tank compelling. Inspiring, invest synergy capacity
            building, white paper; silo, unprecedented challenge B-corp
            problem-solvers.
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Features;
