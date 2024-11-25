import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const CreatePost = () => {
  const [postDetails, setPostDetails] = useState({
    title: "",
    description: "",
  });
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleSequenceEnd = () => {
    setAnimationComplete(true);
  };
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [successPopup, setSuccessPopup] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [imageName, setImageName] = useState("");
  const [videoName, setVideoName] = useState("");

  const navigate = useNavigate();
  const { societyId } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageName(file ? file.name : "");
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    setVideoName(file ? file.name : "");
  };

  const handleCreatePost = async () => {
    setIsLoading(true);
    setSuccessPopup(false);
    setError(null);

    if (
      !postDetails.title.trim() ||
      !postDetails.description.trim() ||
      (!imageFile && !videoFile)
    ) {
      setError(
        "Please provide a title, description, and upload an image or video for your post."
      );
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", postDetails.title);
      formData.append("description", postDetails.description);

      if (imageFile) {
        formData.append("media", imageFile);
      }

      if (videoFile) {
        formData.append("media", videoFile);
      }

      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://localhost:4000/api/v1/societies/${societyId}/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        setSuccessPopup(true);
        setTimeout(() => {
          setSuccessPopup(false);
          navigate(`/societies/${societyId}`);
        }, 3000);
      } else {
        setError("Failed to create the post.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while creating the post.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url("/SocietyS.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
          <div
      className="absolute inset-0 bg-blue-600 opacity-50"
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    ></div>

      <div className="z-10">
        <TypeAnimation
          sequence={[" Create, Connect, Post", 5000]}
          wrapper="span"
          speed={50}
          style={{
            fontSize: "4em",
            fontStyle: "bold",
            display: "inline-block",
            color: "white",
            marginTop: "1rem",
          }}
          repeat={null}
          onSequenceEnd={handleSequenceEnd}
        />
        {animationComplete && <div></div>}
      </div>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 bg-white p-6 border-1 border-gray-300 rounded-md shadow-md max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">
          Create Post
        </h1>
        <form>
          <div className="mb-4">
            <label className="font-bold block mb-1" htmlFor="title">
              Event:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={postDetails.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="font-bold block mb-1" htmlFor="description">
              About:
            </label>
            <textarea
              id="description"
              name="description"
              value={postDetails.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-between">
            <div className="w-48 mb-4">
              <label className="font-bold"></label>
              <label className="bg-blue-500 font-bold ml-3 text-white px-5 py-2 rounded border-none rounded-xl w-40 cursor-pointer block">
                {imageName ? imageName : "Choose Image"}
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <div className="w-48 mb-4">
              <label className="font-bold"></label>
              <label className="bg-blue-500 font-bold ml-3 text-white px-5 py-2 rounded border-none rounded-xl w-40 cursor-pointer block">
                {videoName ? videoName : "Choose Video"}
                <input
                  type="file"
                  accept="video/*"
                  name="video"
                  onChange={handleVideoUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>
          <button
            className="bg-blue-800 text-white w-full font-bold px-5 py-5 rounded rounded-lg mt-4"
            onClick={handleCreatePost}
            disabled={isLoading}
          >
            {isLoading ? "Creating Post..." : "Create Post"}
          </button>
        </form>
        {successPopup && (
          <div className="mt-4 text-green-600">
            <p>Post created successfully</p>
          </div>
        )}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default CreatePost;
