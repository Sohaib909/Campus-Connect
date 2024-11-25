import React, { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import axios from "axios";

const SocietyRegistration = () => {
  const [societyName, setSocietyName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [byLaws, setByLaws] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const popupMessage = "Registration Request Sent!";
  const userToken = localStorage.getItem("authToken");
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {}, [userToken]);

  const resetForm = () => {
    setSocietyName("");
    setDescription("");
    setCharacterCount(0);
    setLogo(null);
    setBanner(null);
    setByLaws("");
    setErrorMessage("");
  };

  const handleRegistration = async () => {
    setIsLoading(true);

    try {
      setErrorMessage("");

      const formData = new FormData();
      formData.append("name", societyName);
      formData.append("description", description);
      formData.append("societyByLaws", byLaws);
      if (logo) {
        formData.append("logo", logo);
      }
      if (banner) {
        formData.append("banner", banner);
      }

      const response = await axios.post(
        "http://localhost:4000/api/v1/societies",
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        setShowPopup(true);
        resetForm();
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      } else {
        setErrorMessage(
          `Society registration failed: ${response.data.message}`
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred during society registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleBannerChange = (e) => {
    setBanner(e.target.files[0]);
  };

  useEffect(() => {
    const countCharacters = () => {
      setCharacterCount(description.length);
    };

    countCharacters();
  }, [description]);

  return (
    <div className="bg-blue-950 relative min-h-screen flex flex-col items-center">
      <video
        src="bgvid.mp4"
        autoPlay="{true}"
        loop
        muted
        className="absolute w-[100%] opacity-5"
      ></video>
      <br />
      <br />
      <br />
      <br />
      <h2 className="font-extrabold mb-4 text-white text-4xl">
        Register your Society
      </h2>
      <div>
        <TypeAnimation
          sequence={[
            "Society registration is a crucial step our platform simplifies the process",
            1000,
            "Enjoy with us",
            1000,
            "",
            1000,
            "Let make the moment mamorable",
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

      <div className="max-w-6xl flex mx-auto p-8 md:p-16 justify-center items-center xxs:flex-col md:flex-row">
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
                    Campus Connect is a dynamic platform designed to foster
                    connections and collaboration within the academic community
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
                    Our website offerse, you can easily browse and check the
                    availability of courses!
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
                    Society registration is a crucial step our platform
                    simplifies the process!
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 xl:w-3/5 dark:bg-gray-800">
              <img src="SocietyS.jpg" alt="Slider 1"></img>
              <br></br>
              <img src="SocietySSS.jpg" alt="Slider 1"></img>
            </div>
          </div>
        </section>

        <div className="md:w-2/3 bg-zinc-400 rounded-lg  sm:w-full mx-4 p-4">
          <h2 className="font-extrabold mb-4 text-white text-2xl">
            Registration Form
          </h2>
          <form className="bg-white relative p-4 rounded shadow-md flex flex-wrap">
            <div className="w-full mb-4">
              <label
                className="block relative text-white-700 text-sm font-bold mb-2"
                htmlFor="societyName"
              >
                Society Name
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="societyName"
                type="text"
                placeholder="Society Name"
                value={societyName}
                onChange={(e) => setSocietyName(e.target.value)}
              />
            </div>
            <div className="w-full mb-4">
              <label
                className="block text-white-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                placeholder="Society Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Character Count: {characterCount}
              </p>
            </div>
            <div className="w-full mb-4">
              <label
                className="block text-white-700 text-sm font-bold mb-2"
                htmlFor="logo"
              >
                Insert a Logo
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="logo"
                type="file"
                onChange={handleLogoChange}
              />
            </div>
            <div className="w-full mb-4">
              <label
                className="block text-white-700 text-sm font-bold mb-2"
                htmlFor="banner"
              >
                Insert a Banner
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="banner"
                type="file"
                onChange={handleBannerChange}
              />
            </div>
            <div className="w-full mb-4">
              <label
                className="block text-white-700 text-sm font-bold mb-2"
                htmlFor="byLaws"
              >
                Society ByLaws
              </label>
              <textarea
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="byLaws"
                placeholder="Society ByLaws"
                value={byLaws}
                onChange={(e) => setByLaws(e.target.value)}
              />
            </div>
            <div className="w-full text-center">
              <button
                onClick={handleRegistration}
                className="bg-blue-900 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                disabled={isLoading}
              >
                {isLoading ? "Sending Request..." : "Register Society"}
              </button>
              {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p>
              )}
            </div>
          </form>

          {showPopup && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-md">
                <p className="text-green-500 mb-2 text-center font-bold">
                  {popupMessage}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocietyRegistration;
