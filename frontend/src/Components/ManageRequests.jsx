import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ManageRequests = () => {
  const { id } = useParams();
  const [society, setSociety] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { societyId } = useParams();
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberRequests, setMemberRequests] = useState([]);
  const [showApprovedPopup, setShowApprovedPopup] = useState(false);
  const [showRejectedPopup, setShowRejectedPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const getCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/users/currentUser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCurrentUser(response.data.data.user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    getCurrentUser();
  }, [id]);

  useEffect(() => {
    const fetchMemberRequests = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get(
          `http://localhost:4000/api/v1/societies/${societyId}/joinRequests?populate=createdBy`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          console.log(response.data.data.joinRequests);
          setMemberRequests(response.data.data.joinRequests);
          setSociety(response.data.data.society);
          console.log("Before state update:", joinRequests);
          setJoinRequests(response.data.data.joinRequests);
          console.log("After state update:", joinRequests);
        } else {
          console.error(
            "Failed to fetch join requests:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching join requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberRequests();
  }, [societyId]);

  const handleStatusChange = async (userId, action) => {
    try {
      const token = localStorage.getItem("authToken");
      const url = `http://localhost:4000/api/v1/societies/${societyId}/manageMembers/manageRequests/${userId}/${action}`;

      const response = await axios.patch(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setJoinRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== userId)
        );

        if (action === "accept") {
          setShowApprovedPopup(true);
          setTimeout(() => {
            setShowApprovedPopup(false);
          }, 3000);

          const userNotification = {
            type: "Join Request Approved",
            message: "Your join request has been approved",
            recipient: userId,
          };
        } else if (action === "reject") {
          setShowRejectedPopup(true);
          setTimeout(() => {
            setShowRejectedPopup(false);
          }, 3000);

          const userNotification = {
            type: "Join Request Rejected",
            message: "Your join request has been rejected",
            recipient: userId,
          };
        }
      } else {
        console.error("Failed to change join request status");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-blue-950 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-center mt-16 text-white">
        Manage Join Requests
      </h1>
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-4xl mb-4">
        <center>
          <h2 className="text-lg font-bold mb-2">Join Requests</h2>
        </center>
        {joinRequests.length === 0 ? (
          <p>No new join requests</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {joinRequests.map((request) => (
              <div key={request._id} className="border rounded p-4">
                <p>
                  <strong>Name:</strong> {request.name}
                </p>
                <div className="mt-2">
                  <button
                    className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover-bg-green-700"
                    onClick={() => handleStatusChange(request._id, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover-bg-red-700 ml-2"
                    onClick={() => handleStatusChange(request._id, "reject")}
                  >
                    Reject
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
              Join Request Approved Successfully
            </p>
          </div>
        </div>
      )}

      {showRejectedPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="text-red-500 mb-2 font-semibold">
              Join Request Rejected
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRequests;
