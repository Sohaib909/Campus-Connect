import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import pdfImage from "./pdf3.png";
import docImage from "./doc.png";
import pptImage from "./ppt.png";
import axios from "axios";

const CourseUpload = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [courseMaterials, setCourseMaterials] = useState([]);
  const [fileInput, setFileInput] = useState(null);
  const [title, setTitle] = useState("");
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const params = useParams();
  const { folderId, folderType } = params;
  console.log("Folder ID:", folderId);
  console.log("Folder Type:", folderType);

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
    console.log("Folder ID:", folderId);
    console.log("Folder Type:", folderType);
    if (folderId !== null) {
      fetchCourseMaterials();
    }
  }, [searchQuery, folderId, folderType]);

  const fetchCourseMaterials = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/course-materials/list?folderId=${folderId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch course materials: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched course materials data:", data);
      setCourseMaterials(data);
    } catch (error) {
      console.error("Failed to fetch course materials.", error);
    }
  };

  const handleFileUpload = async () => {
    if (fileInput) {
      setIsUploadPopupOpen(true);
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", fileInput.files[0]);
      formData.append("title", title);
      formData.append("instructor", currentUser.name);
      formData.append("folderId", folderId);

      try {
        const response = await axios.post(
          "http://localhost:4000/api/v1/course-materials/upload",
          formData
        );

        if (response.status === 201) {
          fetchCourseMaterials();
          setTitle("");
          setIsUploadPopupOpen(false);
          setIsLoading(false);
        } else {
          console.error("File upload failed.");
          setIsUploadPopupOpen(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("File upload failed:", error);
        setIsUploadPopupOpen(false);
        setIsLoading(false);
      }
    }
  };

  const handleDownload = (cloudStorageUrl) => {
    window.open(cloudStorageUrl, "_blank");
  };

  const handleDelete = async (material) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/v1/course-materials/delete/${material._id}`
      );

      const updatedMaterials = courseMaterials.filter(
        (m) => m._id !== material._id
      );
      setCourseMaterials(updatedMaterials);
    } catch (error) {
      console.error("File deletion failed:", error);
    }
  };

  const getImageForFileType = (fileType) => {
    switch (fileType) {
      case "pdf":
        return pdfImage;
      case "docx":
        return docImage;
      case "pptx":
        return pptImage;
      default:
        return pdfImage;
    }
  };

  return (
    <div className="bg-blue-950 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl text-white font-bold mb-4">Course Materials</h1>
        <div className="flex items-center justify-center flex-col mb-6">
          <input
            type="text"
            placeholder="Search for courses..."
            className="w-1/2 py-2 px-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => setIsUploadPopupOpen(true)}
            className="bg-blue-500 text-white py-1 px-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 mt-4"
          >
            Upload Course
          </button>
        </div>

        {isUploadPopupOpen && (
          <UploadCoursePopup
            fileInput={fileInput}
            title={title}
            currentUser={currentUser}
            setFileInput={setFileInput}
            setTitle={setTitle}
            handleFileUpload={handleFileUpload}
            setIsUploadPopupOpen={setIsUploadPopupOpen}
            isLoading={isLoading}
          />
        )}

        <CourseMaterialsList
          courseMaterials={courseMaterials}
          folderId={folderId}
          handleDownload={handleDownload}
          handleDelete={handleDelete}
          getImageForFileType={getImageForFileType}
        />
      </div>
    </div>
  );
};

const UploadCoursePopup = (props) => {
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
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
      <div style={backdropStyle}></div>
      <div style={popupStyle} className="bg-white p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-2">Upload Course Material</h2>
        <input
          type="file"
          name="file"
          accept=".pdf, .docx, .pptx"
          onChange={(e) => props.setFileInput(e.target)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Title"
          value={props.title}
          onChange={(e) => props.setTitle(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Instructor"
          value={props.currentUser.name}
          readOnly
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />
        <div className="flex justify-end">
          <button
            onClick={props.handleFileUpload}
            className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400 mr-2 ${
              props.isLoading ? "cursor-not-allowed" : ""
            }`}
            disabled={props.isLoading}
          >
            {props.isLoading ? "Uploading..." : "Upload"}
          </button>
          <button
            onClick={() => props.setIsUploadPopupOpen(false)}
            className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseMaterialsList = (props) => {
  useEffect(() => {
    console.log(
      "CourseMaterialsList component updated:",
      props.courseMaterials
    );
  }, [props.courseMaterials]);

  if (!props.courseMaterials || props.courseMaterials.length === 0) {
    return <p className="text-white">No course materials available.</p>;
  }

  return (
    <div className="flex flex-col space-y-4">
      {props.courseMaterials.map((material) => (
        <div
          key={material._id}
          className="bg-white rounded-md shadow-md p-4 flex items-center space-x-4"
        >
          <img
            src={props.getImageForFileType(material.fileType)}
            alt={material.title}
            className="w-12 h-12"
          />
          <div className="flex-grow">
            <h3 className="text-md font-semibold text-gray-800">
              {material.title}
            </h3>
            <p className="text-sm text-gray-600">
              Uploaded by: {material.instructor}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => props.handleDownload(material.cloudStorageUrl)}
              className="bg-blue-600 text-white py-1 px-2 rounded hover-bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400"
            >
              Download
            </button>
            <button
              onClick={() => props.handleDelete(material)}
              className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-400"
            >
              {material.isLoading && material.isLoading.delete
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseUpload;
