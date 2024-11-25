import React, { useState, useEffect, useRef } from "react";
import folderImg from "./folder.png";
import { useNavigate, useParams } from "react-router-dom";

const SubjectFolder = () => {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isDeleteSubjectFolderOpen, setIsDeleteSubjectFolderOpen] =
    useState(false);
  const [subjectFolderName, setSubjectFolderName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [photoFile, setPhoto] = useState(null);
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const [deleteSubjectFolderName, setDeleteSubjectFolderName] = useState("");
  const [subjectFolders, setSubjectFolders] = useState([]);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [folder, setFolder] = useState([]);
  const { folderId } = params;

  const inputRef = useRef();
  const deleteInputRef = useRef();

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
        isDeleteSubjectFolderOpen &&
        deleteInputRef.current &&
        !deleteInputRef.current.contains(e.target)
      ) {
        setIsDeleteSubjectFolderOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreateFolderOpen, isDeleteSubjectFolderOpen]);

  const toggleCreateFolder = () => {
    setIsCreateFolderOpen(!isCreateFolderOpen);
  };

  const handleCreateFolder = () => {
    if (!folderId) {
      console.error("Folder ID is undefined");
      return;
    }

    const subjectApiEndpoint = `http://localhost:4000/api/v1/subject/${folderId}`;
    const formData = new FormData();
    formData.append("name", folderName);
    formData.append("photo", photoFile);

    fetch(subjectApiEndpoint, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(`Failed to create subject folder: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setFolders([...folders, data]);
        setFolderName("");
        setPhoto(null);
        setIsCreateFolderOpen(false);
      })
      .catch((error) => {
        console.error("Error creating subject folder:", error);
      });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const toggleDeleteSubjectFolder = () => {
    setIsDeleteSubjectFolderOpen(!isDeleteSubjectFolderOpen);
    if (isCreateFolderOpen) {
      setIsCreateFolderOpen(false);
    }
  };

  const handleDeleteSubjectFolder = () => {
    fetch(`http://localhost:4000/api/v1/subject/${folderId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: deleteSubjectFolderName }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(`Failed to delete subject folder: ${response.status}`);
        }

        setSubjectFolders(
          subjectFolders.filter(
            (folder) => folder.name !== deleteSubjectFolderName
          )
        );
        setDeleteSubjectFolderName("");
        setIsDeleteSubjectFolderOpen(false);
        fetchFolders();
      })
      .catch((error) => {
        console.error("Error deleting subject folder:", error);
      });
  };

  const fetchFolders = () => {
    const subjectApiEndpoint = `http://localhost:4000/api/v1/subject/list/${folderId}`;

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
  };

  useEffect(() => {
    fetchFolders();
  }, [folderId]);

  const navigateToSubjectFolderUpload = (folderId, isMainFolder) => {
    navigate(
      `/subject-folder-upload/${folderId}/${isMainFolder ? "main" : "subject"}`
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
  display: "flex",
  flexDirection: "column", 
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

      <h2 className="text-4xl font-bold text-white mb-4 mt-4">Subjects</h2>
      <br />
      <div style={buttonContainerStyle}>
        <button
          onClick={toggleCreateFolder}
          style={{ ...smallButtonStyle, backgroundColor: "bg-blue-600" }}
          className="bg-blue-500 text-white py-2 px-4 rounded-full hover-bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 mb-2"
        >
          Create Subject Folder
        </button>
        {isDeleteSubjectFolderOpen && (
          <div ref={deleteInputRef} style={popupStyle}>
            <input
              type="text"
              placeholder="Folder Name to Delete"
              value={deleteSubjectFolderName}
              onChange={(e) => setDeleteSubjectFolderName(e.target.value)}
            />
            <button
              onClick={handleDeleteSubjectFolder}
              className="bg-red-600 mt-2 text-white py-2 px-4 rounded hover-bg-red-700 focus:outline-none focus:ring focus:ring-red-400"
            >
              Delete
            </button>
          </div>
        )}
        {isCreateFolderOpen && (
          <div ref={inputRef} style={popupStyle}>
            <input
              type="text"
              placeholder="Subject Folder Name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mt-2 p-2 border border-gray-700 w-full"
            />
            <button
              onClick={handleCreateFolder}
              className="bg-blue-600 mt-2 text-white py-2 px-2 rounded hover-bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400"
            >
              Create
            </button>
          </div>
        )}
        {!isCreateFolderOpen && (
          <button
            onClick={() => toggleDeleteSubjectFolder(folder)}
            style={{ ...smallButtonStyle, backgroundColor: "bg-red-600" }}
            className="bg-red-500 text-white py-2 px-4 rounded-full hover-bg-red-600 focus:outline-none focus:ring focus:ring-red-400 mb-2"
          >
            Delete Subject Folder
          </button>
        )}
      </div>
      <div>
        <div style={folderContainerStyle}>
          {folders.map((folder) => (
            <div key={folder._id} style={folderStyle}>
              <div>
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

export default SubjectFolder;
