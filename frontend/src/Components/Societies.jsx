import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Societies = () => {
  const [approvedSocieties, setApprovedSocieties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const userResponse = await axios.get(
          "http://localhost:4000/api/v1/users/currentUser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCurrentUser(userResponse.data.data.user);

        const societiesResponse = await axios.get(
          "http://localhost:4000/api/v1/societies",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (societiesResponse.data.status === "success") {
          const societiesData = societiesResponse.data.data.societies;

          // Fetch members count for each society
          const membersCountPromises = societiesData.map(async (society) => {
            const membersCountResponse = await axios.get(
              `http://localhost:4000/api/v1/societies/${society._id}/members/count`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return membersCountResponse.data.membersCount;
          });

          const membersCountArray = await Promise.all(membersCountPromises);

          // Update societiesData with membersCount
          societiesData.forEach((society, index) => {
            society.membersCount = membersCountArray[index];
          });

          setApprovedSocieties(societiesData);
        } else {
          console.error("Failed to fetch approved societies");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigateToSociety = (societyId) => {
    navigate(`/societies/${societyId}`);
  };

  const handleCreatePostClick = (societyId) => {
    navigate(`/societies/${societyId}/create-post`);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredSocieties = approvedSocieties.filter((society) =>
    society.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-600 min-h-screen flex flex-col items-center justify-center relative text-white">
      <img
        src="societyS.jpg"
        className="absolute w-[100%] h-[100%] object-cover opacity-50"
        alt="Society Background"
      />
      <button
        className="absolute top-10 right-10 bg-[#FF9503] font-bold text-white px-5 py-2 rounded transform hover:scale-105 transition-transform"
        onClick={() => navigate("/SocietyRegistration")}
      >
        Register Society
      </button>
      <div className="relative">
        <h1 className="text-4xl font-bold mt-16 mb-6 text-center">Societies</h1>
      </div>
      <div className="w-full max-w-4xl">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-xl">Loading...</p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="w-1/2 py-2 px-4 border-2 border-gray-300 rounded-full bg-white text-black transition-transform transform placeholder-black focus:outline-none  z-100"
              />
            </div>
            {filteredSocieties.map((society) => (
              <div
                key={society._id}
                className="mb-8 p-4 border rounded-md cursor-pointer transition-transform transform hover:scale-105 bg-white text-black shadow-lg"
              >
                <div className="mb-4">
                  <img
                    src={society.logo}
                    alt="Society Logo"
                    className="rounded-full w-20 h-20 mx-auto mb-4"
                  />
                </div>
                <p className="mb-2">
                  <strong className="text-xl font-bold">{society.name}</strong>
                </p>
                <p className="mb-2">About: {society.description}</p>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => navigateToSociety(society._id)}
                    className="bg-blue-600 font-bold text-white px-5 py-2 rounded hover:bg-blue-500"
                  >
                    View
                  </button>
                  <button className="bg-blue-600 ml-2 font-bold text-white px-5 py-2 rounded">
                    {society.membersCount} Members
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Societies;
