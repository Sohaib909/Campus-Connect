import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Popup = ({ data, onClose, isUser }) => {
  const popupStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "20px",
    zIndex: 2,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    color: "white",
    padding: "4px 8px",
    borderRadius: "2px",
    cursor: "pointer",
    border: "none",
    fontSize: "10px",
  };

  return (
    <div style={popupStyle}>
      <h2 className="font-bold text-center mt-5">{isUser ? "Member Details" : "Member Details"}</h2>
      <center>
        <img src={data.photo} alt={data.name} className="mt-2 w-20 h-20 rounded-full" />
      </center>
      <p className="font-bold text-center">({data.role})</p>
      <p className="font-bold text-center mt-4">{data.name}</p>
      {isUser && (
        <>
          <p className="font-bold text-center">{data.department}</p>
          <p className="font-bold text-center">{data.specialization}</p>
        </>
      )}
      {!isUser && <p className="font-bold text-center">{data.department}</p>}
      {!isUser && <p className="font-bold text-center">{data.email}</p>}
      {!isUser && <p className="font-bold text-center">{data.specialization}</p>}
      <button onClick={onClose} style={closeButtonStyle}>
        ✕
      </button>
    </div>
  );
};


const ApprovedUsersList = ({ users, onUserClick }) => {
  const handleUserClick = (user) => {
    onUserClick(user);
  };
  return (
    <div className="flex flex-col space-y-4">
      {users.map((user) => (
        <div
          key={user._id}
          className="bg-white rounded-md shadow-md p-4 flex items-center space-x-4"
          onClick={() => onUserClick(user)}
        >
          <img
            src={user.photo}
            alt={user.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-grow">
            <h3 className="text-md font-semibold text-gray-800">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
          <div className="flex space-x-2"></div>
        </div>
      ))}
    </div>
  );
};

const ApprovedUsers = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { societyId } = useParams();

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
  }, []);

  useEffect(() => {
    const fetchApprovedUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!societyId) {
          setError("Society ID is missing");
          return;
        }

        const response = await axios.get(
          `http://localhost:4000/api/v1/societies/${societyId}/viewMembers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          setAdmin(response.data.data.admin);
          setApprovedUsers(response.data.data.members);
        } else {
          setError("Failed to fetch approved users");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch approved users");
        setIsLoading(false);
      }
    };

    const token = localStorage.getItem("authToken");
    fetchApprovedUsers();
  }, [societyId]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleAdminClick = () => {
    setSelectedUser(admin);
  };

  return (
    <div className="bg-blue-950 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-center mt-16 text-white">
        Society Members
      </h1>
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-4xl mb-4">
        <center>
          <h2 className="text-lg font-bold mb-2">Society Members</h2>
        </center>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
          <div
            key={admin._id}
            className="bg-white rounded-md shadow-md p-4 flex items-center space-x-4"
            onClick={handleAdminClick}
          >
            <img src={admin.photo} alt={admin.name} className="w-12 h-12 rounded-full" />
            <div className="flex-grow">
              <h3 className="text-md font-semibold text-gray-800">{admin.name}</h3>
              <p className="text-sm text-gray-500">{admin.role}</p>
            </div>
          </div>
          <ApprovedUsersList users={approvedUsers} onUserClick={handleUserClick} />
          {selectedUser && (
            <div className="popup-overlay">
              <Popup
                data={selectedUser}
                onClose={() => setSelectedUser(null)}
                isUser={admin.role !== "admin"}
              />
            </div>
          )}
        </>
      )}
    </div>
    
    </div>

  );
  
};

export default ApprovedUsers;
