import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addNotification } from "./notificationSlice.js";

const ManageSocieties = () => {
  const [societyRequests, setSocietyRequests] = useState([]);
  const [showApprovedPopup, setShowApprovedPopup] = useState(false);
  const [showRejectedPopup, setShowRejectedPopup] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSocietyRequests = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get(
          "http://localhost:4000/api/v1/societies/manageSocieties",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          const filteredSocieties = response.data.data.societies.filter(
            (society) =>
              society.status !== "approved" && society.status !== "rejected"
          );
          setSocietyRequests(filteredSocieties);
        } else {
          console.error("Failed to fetch society requests");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchSocietyRequests();
  }, []);

  const handleStatusChange = async (societyId, status) => {
    if (status === "approved") {
      setApproveLoading(true);
    } else if (status === "rejected") {
      setRejectLoading(true);
    }

    const society = societyRequests.find(
      (society) => society._id === societyId
    );

    if (!society) {
      console.error("Society not found");
      setApproveLoading(false);
      setRejectLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `http://localhost:4000/api/v1/societies/${societyId}`,
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
        setSocietyRequests((prevSocieties) => {
          return prevSocieties.filter((society) => society._id !== societyId);
        });

        if (status === "approved") {
          setShowApprovedPopup(true);
          setTimeout(() => {
            setShowApprovedPopup(false);
          }, 3000);

          dispatch(
            addNotification({
              type: "Society Approved",
              message: `Your society request for "${society.name}" has been approved.`,
              recipient: society.createdBy,
            })
          );
        } else if (status === "rejected") {
          setShowRejectedPopup(true);
          setTimeout(() => {
            setShowRejectedPopup(false);
          }, 3000);

          dispatch(
            addNotification({
              type: "Society Rejected",
              message: `Your society request for "${society.name}" has been rejected.`,
              recipient: society.createdBy,
            })
          );
        }

        setApproveLoading(false);
        setRejectLoading(false);
      } else {
        console.error("Failed to change society request status");
        setApproveLoading(false);
        setRejectLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setApproveLoading(false);
      setRejectLoading(false);
    }
  };

  return (
    <div className="bg-blue-950 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-center mt-16 text-white">
        Manage Societies
      </h1>
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-4xl mb-4">
        <center>
          <h2 className="text-lg font-bold mb-2">Society Approval Requests</h2>
        </center>
        {societyRequests.length === 0 ? (
          <p>No new society requests</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {societyRequests.map((society) => (
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
                  <strong>Name:</strong> {society.name}
                </p>
                <p>
                  <strong>Description:</strong> {society.description}
                </p>
                <p>
                  <strong>Status:</strong> {society.status}
                </p>
                <p>
                  <strong>Created By:</strong>{" "}
                  {society.userInfo ? society.userInfo.name : "N/A"}
                </p>
                <div className="mt-2">
                  <button
                    className={`bg-green-500 text-white font-semibold py-2 px-4 rounded hover-bg-green-700 ${
                      approveLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleStatusChange(society._id, "approved")}
                    disabled={
                      society.status === "approved" ||
                      society.status === "rejected" ||
                      approveLoading
                    }
                  >
                    {approveLoading ? "Approving..." : "Approve"}
                  </button>
                  <button
                    className={`bg-red-500 text-white font-semibold py-2 px-4 rounded hover-bg-red-700 ml-2 ${
                      rejectLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleStatusChange(society._id, "rejected")}
                    disabled={
                      society.status === "approved" ||
                      society.status === "rejected" ||
                      rejectLoading
                    }
                  >
                    {rejectLoading ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showApprovedPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="text-green-500 mb-2 font-semibold">
              Society Approved Successfully
            </p>
          </div>
        </div>
      )}

      {showRejectedPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="text-red-500 mb-2 font-semibold">Society Rejected</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSocieties;
