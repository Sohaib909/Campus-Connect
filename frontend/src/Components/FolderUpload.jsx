import React, { useState, useEffect, useRef } from "react";
import folderImg from "./folder.png";
import { useNavigate, useParams } from "react-router-dom";

const FolderUpload = () => {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isDeleteFolderOpen, setIsDeleteFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [deleteFolderName, setDeleteFolderName] = useState("");
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef();
  const deleteInputRef = useRef();
  const { mainFolderId } = useParams();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isCreateFolderOpen &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsCreateFolderOpen(false);
      }
      if (
        isDeleteFolderOpen &&
        deleteInputRef.current &&
        !deleteInputRef.current.contains(e.target)
      ) {
        setIsDeleteFolderOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreateFolderOpen, isDeleteFolderOpen]);

  const toggleCreateFolder = () => {
    setIsCreateFolderOpen(!isCreateFolderOpen);
    if (isDeleteFolderOpen) {
      setIsDeleteFolderOpen(false);
    }
  };

  const toggleDeleteFolder = () => {
    setIsDeleteFolderOpen(!isDeleteFolderOpen);
    if (isCreateFolderOpen) {
      setIsCreateFolderOpen(false);
    }
  };

  const handleCreateFolder = () => {
    fetch("http://localhost:4000/api/v1/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ name: folderName, parentFolderId: null }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(`Failed to create folder: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const folderId = data._id;
        setFolders([...folders, data]);
        setFolderName("");
        setIsCreateFolderOpen(false);
      })
      .catch((error) => {
        console.error("Error creating folder:", error);
      });
  };

  const handleDeleteFolder = () => {
    fetch("http://localhost:4000/api/v1/folders", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: deleteFolderName }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(`Failed to delete folder: ${response.status}`);
        }

        setFolders(
          folders.filter((folder) => folder.name !== deleteFolderName)
        );
        setDeleteFolderName("");
        setIsDeleteFolderOpen(false);
        setFolderToDelete(null);
      })
      .catch((error) => {
        console.error("Error deleting folder:", error);
      });
  };

  useEffect(() => {
    fetch("http://localhost:4000/api/v1/folders")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch folders");
        }
        return response.json();
      })
      .then((data) => {
        setFolders(data);
      })
      .catch((error) => {
        console.error("Error fetching folders:", error);
      });
  }, []);

  const navigateToSubjectFolder = (folderId, isMainFolder) => {
    navigate(
      `/subject-folder/${folderId}/${isMainFolder ? "main" : "subject"}`
    );
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
      {(isCreateFolderOpen || isDeleteFolderOpen) && (
        <div style={backdropStyle}></div>
      )}

      <h2 className="text-4xl font-bold text-white mb-4 mt-4">
        Course Material Categories
      </h2>
      <br />
      <div style={buttonContainerStyle}>
        <button
          onClick={toggleCreateFolder}
          style={{ ...smallButtonStyle, backgroundColor: "bg-blue-600" }}
          className="bg-blue-500 text-white py-2 px-4 rounded-full hover-bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 mb-2"
        >
          Create Folder
        </button>
        <button
          onClick={toggleDeleteFolder}
          style={{ ...smallButtonStyle, backgroundColor: "bg-red-600" }}
          className="bg-red-500 text-white py-2 px-4 rounded-full hover-bg-red-600 focus:outline-none focus:ring focus:ring-red-400 mb-2"
        >
          Delete Folder
        </button>
        {isDeleteFolderOpen && (
          <div ref={deleteInputRef} style={popupStyle}>
            <input
              type="text"
              placeholder="Folder Name to Delete"
              value={deleteFolderName}
              onChange={(e) => setDeleteFolderName(e.target.value)}
            />
            <button
              onClick={handleDeleteFolder}
              className="bg-red-600 text-white py-2 px-4 rounded hover-bg-red-700 focus:outline-none focus:ring focus:ring-red-400"
            >
              Delete
            </button>
          </div>
        )}
        {isCreateFolderOpen && (
          <div ref={inputRef} style={popupStyle}>
            <input
              type="text"
              placeholder="Folder Name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <button
              onClick={handleCreateFolder}
              className="bg-blue-600 text-white py-2 px-4 rounded hover-bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400"
            >
              Create
            </button>
          </div>
        )}
      </div>
      <div>
        <div style={folderContainerStyle}>
          {folders.map((folder) => (
            <div key={folder._id} style={folderStyle}>
              <div
                onClick={() => navigateToSubjectFolder(folder._id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={folderImg}
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

export default FolderUpload;
