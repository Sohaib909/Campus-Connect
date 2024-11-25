import React, { useState, useEffect, useRef } from "react";
import folderImg from "./folder.png";
import { useNavigate, useParams } from "react-router-dom";

const SubFolder = () => {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  console.log("Route Params:", params);
  const { folderId } = params;
  console.log("mainFolderId:", folderId);

  const inputRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isCreateFolderOpen &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsCreateFolderOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreateFolderOpen]);

  const toggleCreateFolder = () => {
    setIsCreateFolderOpen(!isCreateFolderOpen);
  };

  const handleCreateFolder = () => {
    if (!folderId) {
      console.error("Folder ID is undefined");
      return;
    }

    const subjectApiEndpoint = `http://localhost:4000/api/v1/subject/${folderId}`;
    console.log("API Endpoint:", subjectApiEndpoint);

    fetch(subjectApiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: folderName }),
    })
      .then((response) => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw Error(`Failed to create subject folder: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Server Response:", data);
        setFolders([...folders, data]);
        setFolderName("");
        setIsCreateFolderOpen(false);
      })
      .catch((error) => {
        console.error("Error creating subject folder:", error);
      });
  };

  useEffect(() => {
    const subjectApiEndpoint = `http://localhost:4000/api/v1/subject/list/${folderId}`;

    console.log("Fetching subject folders for mainFolderId:", folderId);

    fetch(subjectApiEndpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch subject folders");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setFolders(data);
        } else {
          console.error("API response is not an array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching subject folders:", error);
      });
  }, [folderId]);

  const navigateToCourseUpload = (folderId, folderType) => {
    navigate(`/course-upload/${folderId}/${folderType || "main"}`, {
      state: { folderId },
    });
  };

  const foldersPerRow = 4;

  const folderContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const folderStyle = {
    width: `calc(${100 / foldersPerRow}% - 20px)`,
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

  const buttonContainerStyle = {
    position: "absolute",
    top: 110,
    left: 30,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    zIndex: 1,
  };

  const smallButtonStyle = {
    padding: "6px 14px",
    fontSize: "16px",
    borderRadius: "6px",
  };

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

  const backdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  };

  return (
    <div className="bg-blue-950 min-h-screen flex flex-col justify-center items-center">
      {isCreateFolderOpen && <div style={backdropStyle}></div>}

      <h2 className="text-4xl font-bold text-white mb-4 mt-4">
        Subject Folders
      </h2>
      <br />
      <div>
        <div style={folderContainerStyle}>
          {folders.map((folder) => (
            <div key={folder._id} style={folderStyle}>
              <div
                onClick={() => navigateToCourseUpload(folder._id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={folder.photo || folderImg}
                  alt={folder.name}
                  style={folderImageStyle}
                />
                <div style={folderNameStyle}>{folder.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubFolder;
