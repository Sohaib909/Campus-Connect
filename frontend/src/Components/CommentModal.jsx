import React, { useState } from "react";
import axios from "axios";

const CommentModal = ({ post, closeModal }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const handleCommentSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://localhost:4000/api/v1/posts/${post._id}/comments`,
        { comment: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        const newComment = response.data.data.comment;
        setComments([...comments, newComment]);
        setCommentText("");
      }
    } catch (error) {
      console.error("Error creating a comment:", error);
    }
  };

  return (
    <div className="comment-modal">
      <button onClick={closeModal}>Close</button>
      <h3>Post Comments</h3>
      <div>
        {comments.map((comment) => (
          <div key={comment._id}>
            <strong>{comment.userName}:</strong> {comment.comment}
          </div>
        ))}
      </div>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
      ></textarea>
      <button onClick={handleCommentSubmit}>Submit Comment</button>
    </div>
  );
};

export default CommentModal;
