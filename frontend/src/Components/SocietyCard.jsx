import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SocietyCard = () => {
  const { id } = useParams();
  const [society, setSociety] = useState(null);
  const [societyPosts, setSocietyPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [activePostId, setActivePostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [showViewComments, setShowViewComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [joinRequestSent, setJoinRequestSent] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [membersCount, setMembersCount] = useState(0);
  const [isMember, setIsMember] = useState(false);
const [membershipStatus, setMembershipStatus] = useState(null);


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
        setCurrentUser(response.data.data.user || null);

        if (response.data.data.user && society) {
          const hasSentRequest = society.joinRequests.some(
            (request) => request.user._id === response.data.data.user._id
          );
          setJoinRequestSent(hasSentRequest);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    getCurrentUser();

    axios
      .get(`http://localhost:4000/api/v1/societies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          setSociety(response.data.data.society);
          console.log("Society Object:", response.data.data.society);
        } else {
          console.error("Failed to fetch society details");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);

  const fetchSocietyPosts = (societyId) => {
    const token = localStorage.getItem("authToken");

    axios
      .get(`http://localhost:4000/api/v1/societies/${societyId}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          setSocietyPosts(response.data.data.posts);
        } else {
          console.error("Failed to fetch society posts");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCommentPost = (postId) => {
    setActivePostId(postId);
    setComments([]);
    setShowCommentSection(!showCommentSection);
    setShowViewComments(false);
  };

  const handleViewComments = (postId) => {
    setActivePostId(postId);
    setComments([]);
    setShowViewComments(!showViewComments);
    setShowCommentSection(false);
  };

  const handleToggleCommentSection = () => {
    setShowCommentSection(!showCommentSection);
    setShowViewComments(false);
    setShowDropdown(false);
  };

  const handleToggleViewComments = (postId) => {
    setActivePostId(postId);
    setComments([]);
    fetchCommentsForActivePost();
    setShowViewComments(!showViewComments);
    setShowCommentSection(false);
  };

  const handleOpenDropdown = () => {
    setShowDropdown(true);
    setShowCommentSection(false);
    setShowViewComments(false);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  const fetchCommentsForActivePost = async () => {
    try {
      setLoadingComments(true);

      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `http://localhost:4000/api/v1/comments/${activePostId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setComments(response.data.data.comments);
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCreateComment = async () => {
    if (!commentText) {
      return;
    }

    const token = localStorage.getItem("authToken");

    axios
      .post(
        `http://localhost:4000/api/v1/comments/${activePostId}/createComment`,
        {
          comment: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          setCommentText("");
          fetchCommentsForActivePost();
          setShowViewComments(true);
        } else {
          console.error("Failed to create the comment");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchSocietyPosts(id);
  }, [id]);

  const handleCreatePostClick = (societyId) => {
    navigate(`/societies/${societyId}/create-post`);
  };

  useEffect(() => {
    if (popupMessage) {
      toast.success(popupMessage);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  }, [popupMessage]);

  useEffect(() => {
    const fetchMembersCount = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:4000/api/v1/societies/${id}/members/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response from backend:", response);

        if (response.data.status === "success") {
          console.log("Members count:", response.data.membersCount);
          setMembersCount(response.data.membersCount);
        } else {
          console.error("Failed to fetch members count");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchMembersCount();
  }, [id]);

  const handleManageRequests = (societyId) => {
    if (currentUser && currentUser._id === society.userInfo._id) {
      navigate(`/societies/${societyId}/manage-requests`);
    } else {
    }
  };

  const getAllMembers = (societyId) => {
    if (
      currentUser &&
      (currentUser._id === society.userInfo._id ||
        currentUser._id !== society.userInfo._id)
    ) {
      navigate(`/societies/${societyId}/all-members`);
    } else {
    }
  };

  const handleLikePost = async (postId, index) => {
    const updatedPosts = [...societyPosts];
    const post = updatedPosts[index];

    const token = localStorage.getItem("authToken");

    axios
      .patch(`http://localhost:4000/api/v1/societies/${postId}/like`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          post.liked = !post.liked;
          updatedPosts[index] = post;
          setSocietyPosts(updatedPosts);
        } else {
          console.error("Failed to like/unlike the post");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  useEffect(() => {
    const checkMembership = async () => {
      if (currentUser && society) {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/v1/societies/${id}/isUserMember`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
  
          if (response.data.status === "success") {
            setMembershipStatus(response.data.isMember);
          } else {
            console.error("Failed to fetch membership status");
          }
        } catch (error) {
          console.error("Error checking membership:", error);
        }
      }
    };
  
    checkMembership();
  }, [currentUser, society, id]);
  
  
  const handleJoinSocietyClick = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/societies/${society._id}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === "success") {
        setJoinRequestSent(true);
        setPopupMessage("Request Sent");
        setShowPopup(true);
      } else if (
        response.data.status === "fail" &&
        response.data.message === "You are already a member of this society"
      ) {
        setPopupMessage("Already a member");
        setShowPopup(true);
      } else {
        setPopupMessage("Request Failed");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 400) {
        setPopupMessage("Already a member");
        setShowPopup(true);
      }
    }
  };

  const renderJoinButton = () => {
    if (membershipStatus === true) {
      return (
        <p className="bg-green-500 text-white text-center font-bold px-4 py-2 rounded" style={{ width: "122px", height: "40px" }}>
          Joined
        </p>
      );
    } else if (currentUser && society && society.userInfo && society.userInfo._id !== currentUser._id) {
      const userJoinedSocieties = currentUser.joinedSocieties || [];
      const isMember = userJoinedSocieties.includes(society._id);
  
      return (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleJoinSocietyClick}
          disabled={joinRequestSent || isMember}
        >
          {isMember ? "Joined" : (joinRequestSent ? "Request Sent" : "Join Society")}
        </button>
      );
    } else {
      return null;
    }
  };
    

  useEffect(() => {
    if (popupMessage) {
      toast.success(popupMessage);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  }, [popupMessage]);

  const uploadButtonStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
  };

  const createPostButtonStyle = {
    ...uploadButtonStyle,
    backgroundColor: "#0056b3",
    width: "100",
  };

  const manageRequestButtonStyle = {
    ...uploadButtonStyle,
    backgroundColor: "#0056b3",
    width: "100",
  };

  const followerButtonStyle = {
    ...uploadButtonStyle,
    backgroundColor: "#0056b3",
    width: "100",
  };

  const joinSocietyButtonStyle = {
    ...uploadButtonStyle,
    backgroundColor: " #008000",
    width: "100",
  };

  const gradientBackground = {
    background: "linear-gradient(to right, #0056b3, #003366, #1a1a1a)",
  };

  const titleStyle = {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textAlign: "center",
    color: "#fff",
  };

  const cardContainerStyle = {
    background: "rgba(26, 26, 26, 0.9)",
    borderRadius: "10px",
    padding: "20px",
    margin: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };
  
  const renderButtons = () => {
    if (currentUser && society && society.userInfo && society.userInfo._id === currentUser._id) {
      return (
        <div className="flex flex-col space-y-2">
          <button
            className="bg-blue-600 text-white font-bold px-2 py-2 rounded hover:bg-blue-500"
            onClick={() => handleCreatePostClick(society._id)}
          >
            Create Post
          </button>
  
          <button
            className="bg-blue-600 font-bold text-white px-2 py-2 rounded hover:bg-blue-500"
            onClick={() => handleManageRequests(society._id)}
          >
            Manage Requests
          </button>
  
          {membersCount !== null && (
            <button
              className="bg-blue-600 font-bold text-white px-2 py-2 rounded hover:bg-blue-500"
              onClick={() => getAllMembers(society._id)}
            >
              {membersCount} Members
            </button>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col space-y-2">
          {renderJoinButton()}
  
          {membersCount !== null && (
            <button
              className="bg-blue-500 font-bold text-white px-2 py-2 rounded hover:bg-blue-600"
              onClick={() => getAllMembers(society._id)}
            >
              {membersCount} Members
            </button>
          )}
        </div>
      );
    }
  };
  

  return (
    <div
      style={gradientBackground}
      className="min-h-screen flex flex-col items-center justify-center text-gray-200"
    >
      <h1 style={titleStyle}>Society Details</h1>
      {society ? (
        <div className="flex flex-col items-center text-black">
          {/* Banner section */}
          <div
            className="w-full h-60 bg-cover bg-center mb-4 relative"
            style={{ backgroundImage: `url(${society.banner})` }}
          >
            <div className="flex items-end h-full p-4 absolute w-full">
              <div
                className="rounded-full border-2 mb-2"
                style={{ width: "70px", height: "70px", overflow: "hidden" }}
              >
                <img
                  src={society.logo}
                  alt="Society Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4">
                <p className="font-bold text-xl text-black">{society.name}</p>
              </div>
            </div>
          </div>

  {/* Society description */}
  <div className="w-full max-w-4xl flex space-x-4 mb-4">
            <div className="bg-white rounded-lg shadow-md p-4 flex-grow">
              <p className="text-black">
                <strong>Description:</strong> {society.description}
              </p>
            </div>

            <div className="flex flex-col w-2/5">
              {renderButtons()}
            </div>
          </div>          <div className="w-[900px] max-w-4xl">
            <h2 className="text-xl font-bold mb-4 text-white">Society Posts</h2>
            {societyPosts.length > 0 ? (
              societyPosts.map((post, index) => (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-md p-4 mb-4"
                >
                  <div flex items-center p-4>
                    <div
                      className="rounded-full border-2 mb-2"
                      style={{
                        width: "70px",
                        height: "70px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={society.logo}
                        alt="Society Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-xl text-black ml-4">
                      {society.name}
                    </p>
                  </div>
                  <p className="text-black">
                    <strong>Event:</strong> {post.title}
                  </p>
                  <p className="text-black">
                    <strong></strong> {post.description}
                  </p>
                  {post.media && post.media.length > 0 && (
                    <div className="mt-2">
                      {post.media.map((mediaUrl, mediaIndex) => (
                        <div key={mediaIndex} className="mb-2">
                          {mediaUrl.endsWith(".mp4") ? (
                            <video
                              controls
                              src={mediaUrl}
                              alt={`Video ${mediaIndex + 1}`}
                              className="w-full rounded-md mb-2"
                            />
                          ) : (
                            <img
                              src={mediaUrl}
                              alt={`Image ${mediaIndex + 1}`}
                              className="w-full rounded-md mb-2"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2">
                    <button
                      className={`text-sm font-bold ${
                        post.liked ? "text-red-500" : "text-gray-500"
                      }`}
                      onClick={() => handleLikePost(post._id, index)}
                    >
                      {post.liked ? "Unlike" : "Like"}
                    </button>

                    <button
                      className={`text-sm font-bold text-gray-500 ml-4 ${
                        showCommentSection ? "hover:text-blue-500" : ""
                      }`}
                      onClick={() => handleCommentPost(post._id)}
                    >
                      Comment
                    </button>

                    <button
                      className={`text-sm font-bold text-gray-500 ml-4 ${
                        showViewComments ? "text-blue-500" : ""
                      }`}
                      onClick={() => handleToggleViewComments(post._id)}
                    >
                      View Comments
                    </button>
                  </div>

                  {activePostId === post._id && showCommentSection && (
                    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
                      <textarea
                        rows="1"
                        placeholder="Write your comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        style={{
                          border: "none",
                          outline: "none",
                          padding: "0",
                          width: "100%",
                        }}
                      />
                      <button
                        className="text-sm font-bold text-blue-500 mt-2"
                        onClick={handleCreateComment}
                      >
                        Create Comment
                      </button>
                    </div>
                  )}

                  {activePostId === post._id && showViewComments && (
                    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
                      {loadingComments ? (
                        <p>Loading comments...</p>
                      ) : comments.length > 0 ? (
                        <div className="mt-4 max-h-40 overflow-y-auto">
                          <h2 className="text-xl font-bold mb-2 text-black">
                            Comments
                          </h2>
                          {comments.map((comment) => (
                            <div key={comment._id} className="mb-2">
                              <p className="font-bold text-black">
                                {comment.userName}
                              </p>
                              <p className="text-black">{comment.comment}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No comments</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No posts available</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SocietyCard;
