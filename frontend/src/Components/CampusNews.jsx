import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import Lottie from "lottie-react";
import News2 from "../Animation/_News2.json";

const CampusNews = () => {
  const [societies, setSocieties] = useState([]);
  const [loadingSocieties, setLoadingSocieties] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePostId, setActivePostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [showViewComments, setShowViewComments] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [activePostIds, setActivePostIds] = useState([]);
  const [commentSectionOpen, setCommentSectionOpen] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navigate = useNavigate();

  const handleLike = async (postId, index) => {
    const updatedPosts = [...allPosts];
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
          setAllPosts(updatedPosts);
        } else {
          console.error("Failed to like/unlike the post");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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

  const handleToggleCommentSection = (postId) => {
    setActivePostId((prev) => (prev === postId ? null : postId));
    setActiveDropdown("comments");
  };

  const handleToggleViewComments = (postId) => {
    setActivePostId((prev) => (prev === postId ? null : postId));
    setActiveDropdown("viewComments");
    fetchCommentsForActivePost();
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
    const fetchAllPosts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const postsResponse = await axios.get(
          "http://localhost:4000/api/v1/campusNews/Allposts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (postsResponse.status !== 200) {
          console.error(
            `Failed to fetch all posts. Status: ${postsResponse.status}`
          );
        } else if (postsResponse.data.status === "success") {
          const sortedPosts = postsResponse.data.data.posts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setAllPosts(sortedPosts);
        } else {
          console.error("Failed to fetch all posts");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    const fetchSocieties = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const societiesResponse = await axios.get(
          "http://localhost:4000/api/v1/societies",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (societiesResponse.status !== 200) {
          console.error(
            `Failed to fetch societies. Status: ${societiesResponse.status}`
          );
        } else if (societiesResponse.data.status === "success") {
          setSocieties(societiesResponse.data.data.societies);
        } else {
          console.error("Failed to fetch societies");
        }

        setLoadingSocieties(false);
      } catch (error) {
        console.error("Error:", error);
        setLoadingSocieties(false);
      }
    };

    fetchAllPosts();
    fetchSocieties();
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-900 to-gray-800 min-h-screen flex flex-col items-center justify-center text-gray-200">
      <div className="item flex">
        <h1 className="text-7xl font-bold mb-6 text-center mt-16 text-white">
          Campus News
        </h1>
        <Lottie className="mt-8 h-36 w-38" animationData={News2} />
      </div>
      <div className="w-full text-center">
        <TypeAnimation
          sequence={[
            "Stay Informed, Stay Connected",
            1000,
            "Stay Informed, Stay Connected",
            1000,
            "Stay Informed, Stay Connected",
            1000,
            "Stay Informed, Stay Connected",
            1000,
          ]}
          wrapper="span"
          speed={50}
          style={{ fontSize: "4rem", display: "inline-block", color: "white" }}
          repeat={Infinity}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-4 max-w-screen-xl mt-20">
        <div className="col-span-1 text-gray-200" style={{ maxWidth: "600px" }}>
          <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
          {allPosts.slice(0, 4).map((event, index) => (
            <Link to={`/societies/${event.societyInfo._id}`} key={index}>
              <div
                key={index}
                className="bg-gradient-to-r from-blue-800 to-gray-700 rounded-lg shadow-lg mb-4 p-6 transform transition duration-300 hover:scale-105"
              >
                <div
                  className="rounded-full border-2 mr-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={event.societyInfo.logo}
                    alt="Society Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {event.title}
                </h3>
                <p className="text-gray-300">{event.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="col-span-1 text-gray-200">
          {loading ? (
            <p className="text-gray-200">Loading...</p>
          ) : (
            <div className="w-full">
              {allPosts.length > 0 ? (
                allPosts.map((post, index) => (
                  <div
                    key={post._id}
                    className="bg-gradient-to-r from-blue-800 to-gray-700 rounded-lg shadow-lg mb-4 overflow-hidden transform transition duration-300 hover:scale-105"
                  >
                    {/* Society information */}
                    {post.societyInfo && (
                      <div className="flex items-center p-4">
                        {post.societyInfo && (
                          <Link
                            to={`/societies/${post.societyInfo._id}`}
                            className="flex items-center"
                          >
                            <div
                              className="rounded-full border-2 mb-2"
                              style={{
                                width: "70px",
                                height: "70px",
                                overflow: "hidden",
                              }}
                            >
                              <img
                                src={post.societyInfo.logo}
                                alt="Society Logo"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="font-bold text-xl text-blue-900 ml-4 text-white">
                              <Link
                                to={`/societies/${post.societyInfo._id}`}
                                className="cursor-pointer"
                              >
                                {post.societyInfo.name}
                              </Link>
                            </p>
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Post content */}
                    <div className="p-4">
                      <p className="text-white">
                        <strong>{post.title}</strong>
                      </p>
                      <p className="text-white">
                        <strong></strong> {post.description}
                      </p>
                      {/* Media content */}
                      {post.media && post.media.length > 0 && (
                        <div className="relative">
                          {post.media.map((mediaUrl, mediaIndex) => (
                            <div key={mediaUrl} className="mb-2">
                              {mediaUrl.endsWith(".mp4") ? (
                                <video
                                  controls
                                  src={mediaUrl}
                                  alt={`Video ${mediaIndex + 1}`}
                                  className="w-full rounded-t-md mb-2"
                                />
                              ) : (
                                <img
                                  src={mediaUrl}
                                  alt={`Image ${mediaIndex + 1}`}
                                  className="w-full rounded-t-md mb-2"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Like and Comment buttons */}
                      <div className="mt-2 flex items-center space-x-4">
                        <button
                          className={`text-sm font-bold ${
                            post.liked ? "text-red-500" : "text-white"
                          }`}
                          onClick={() => handleLike(post._id, index)}
                        >
                          {post.liked ? "Unlike" : "Like"}
                        </button>

                        <button
                          className={`text-sm font-bold text-white ${
                            activePostId === post._id &&
                            activeDropdown === "comments"
                              ? "hover:text-gray-200"
                              : ""
                          }`}
                          onClick={() => handleToggleCommentSection(post._id)}
                        >
                          Comment
                        </button>

                        <button
                          className={`text-sm font-bold text-white ${
                            activePostId === post._id &&
                            activeDropdown === "viewComments"
                              ? "text-gray-200"
                              : ""
                          }`}
                          onClick={() => handleToggleViewComments(post._id)}
                        >
                          View Comments
                        </button>
                      </div>

                      {activePostId === post._id &&
                        activeDropdown === "comments" && (
                          <div className="bg-gray-800 text-black rounded-lg shadow-md p-4 mt-4">
                            <textarea
                              rows="3"
                              placeholder="Write your comment..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className="w-full p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            />
                            <button
                              className="text-sm font-bold text-white mt-2 px-4 py-2 rounded-md bg-gray-700"
                              onClick={handleCreateComment}
                            >
                              Create Comment
                            </button>
                          </div>
                        )}

                      <div className="overflow-auto max-h-[40vh] mt-4">
                        {activePostId === post._id &&
                          activeDropdown === "viewComments" && (
                            <div className="bg-gray-800 rounded-lg shadow-md p-4">
                              {loadingComments ? (
                                <p>Loading comments...</p>
                              ) : comments.length > 0 ? (
                                <div className="mt-4">
                                  <h2 className="text-xl font-bold mb-2 text-blue-900">
                                    Comments
                                  </h2>
                                  {comments.map((comment) => (
                                    <div key={comment._id} className="mb-2">
                                      <p className="font-bold text-white">
                                        {comment.userName}
                                      </p>
                                      <p className="text-white">
                                        {comment.comment}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p>No comments</p>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white">No posts available</p>
              )}
            </div>
          )}
        </div>

        <div className="col-span-1 text-gray-200">
          <h2 className="text-3xl font-bold mb-4">Societies List</h2>
          {loadingSocieties ? (
            <p>Loading societies...</p>
          ) : (
            <div className="md:ml-auto grid grid-cols-1 gap-8">
              {societies.map((society) => (
                <div
                  key={society._id}
                  className="bg-gradient-to-r from-blue-800 to-gray-700 rounded-lg shadow-lg p-6 mb-4 transform transition duration-300 hover:scale-105"
                >
                  <Link
                    to={`/societies/${society._id}`}
                    className="text-white flex flex-col items-center"
                  >
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
                        alt={`${society.name} Logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-xl">{society.name}</p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampusNews;
