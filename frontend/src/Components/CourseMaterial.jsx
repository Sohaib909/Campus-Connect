import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import pdfImage from "./pdf3.png";
import docImage from "./doc.png";
import pptImage from "./ppt.png";
import axios from "axios";

const CourseMaterial = () => {
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
        </div>

        <CourseMaterialsList
          courseMaterials={courseMaterials}
          folderId={folderId}
          handleDownload={handleDownload}
          getImageForFileType={getImageForFileType}
        />
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseMaterial;
