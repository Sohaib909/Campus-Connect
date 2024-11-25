import React, { useState, useEffect } from "react";
import axios from "axios";

const ApprovedSocieties = () => {
  const [approvedSocieties, setApprovedSocieties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    axios
      .get("http://localhost:4000/api/v1/societies/approvedSocieties", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          setApprovedSocieties(response.data.data.societies);
        } else {
          console.error("Failed to fetch approved societies");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }, []);

  const handleSocietyStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://localhost:4000/api/v1/societies/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        const updatedSocieties = approvedSocieties.map((society) => {
          if (society._id === id) {
            society.status = status;
          }
          return society;
        });
        setApprovedSocieties(updatedSocieties);
      } else {
        console.error("Failed to change society status");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-blue-950 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-center mt-16 text-white">
        Approved Societies
      </h1>
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-4xl mb-4">
        <center>
          <h2 className="text-lg font-bold mb-2">Approved Societies</h2>
        </center>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {approvedSocieties.map((society) => (
              <div key={society._id} className="border rounded p-4">
                <p>
                  <strong>Logo:</strong>{" "}
                  <img
                  className="mt-2 w-20 h-20 rounded-full"
                    src={society.logo}
                    alt="Society Logo"
                    
                  />
                </p>
                
                <p>
                  <strong>Created By:</strong>{" "}
                  {society.userInfo ? society.userInfo.name : "N/A"}
                </p>
                
                <p>
                  <strong>Society Name:</strong> {society.name}
                </p>
                <p>
                  <strong>Status:</strong> {society.status}
                </p>
                <p>
                  <strong>Description:</strong> {society.description}
                </p>
               
               
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovedSocieties;
