import React, { useState, useEffect } from "react";
import folderImg from "./folder.png";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import Lottie from "lottie-react";
import Download2 from "../Animation/_Download2 (1).json";

const StudentFolder = () => {
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/folders");
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      } else {
        console.error("Failed to fetch folders.");
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const navigateToStudentSubFolder = (folderId, isMainFolder) => {
    navigate(
      `/student-sub-folder/${folderId}/${isMainFolder ? "main" : "subject"}`
    );
  };

  const folderContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const folderStyle = {
    width: "calc(25% - 20px)",
    textAlign: "center",
    marginBottom: "20px",
    cursor: "pointer",
  };

  const folderImageStyle = {
    width: "170px",
    height: "auto",
  };

  const folderNameStyle = {
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <div className="bg-blue-950 min-h-screen flex flex-col justify-center items-center">
      <Lottie
        className="z-50 py-0 text-white h-36 w-36"
        animationData={Download2}
      />
      <div className="mt-0"></div>
      <h2 className="text-4xl font-bold text-white mb-4 mt-4">
        Course Material Categories
      </h2>
      <div>
        <center>
          <div className="flex flex-wrap">
            {folders.map((folder) => (
              <div
                key={folder._id}
                className="w-1/4 pr-5 relative transform transition-transform hover:-translate-y-2"
              >
                <div
                  onClick={() => navigateToStudentSubFolder(folder._id)}
                  className="cursor-pointer"
                >
                  <img
                    src={folderImg}
                    alt={folder.name}
                    style={folderImageStyle}
                  />
                  <div
                    style={folderNameStyle}
                    className="text-white font-bold cursor-pointer"
                  >
                    {folder.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </center>
      </div>
    </div>
  );
};

export default StudentFolder;
