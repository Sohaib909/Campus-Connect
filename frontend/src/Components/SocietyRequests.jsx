import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SocietyRequests = () => {
  const { id } = useParams();
  const [society, setSociety] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
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

  return (
    <div className="bg-blue-950 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-center mt-16 text-white">
        Manage Society
      </h1>
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-xl mb-4">
        <div className="flex flex-col items-center">
          <Link to="/ManageRequests" className="w-full">
            <button className="w-full bg-blue-950 text-white font-semibold py-2 rounded focus-outline-none focus-shadow-outline hover:bg-blue-700">
              Manage Requests
            </button>
          </Link>
          <Link to="/ApprovedUsers" className="w-full mt-4">
            <button className="w-full bg-blue-950 text-white font-semibold py-2 rounded focus-outline-none focus-shadow-outline hover:bg-blue-700">
              All Users
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SocietyRequests;
