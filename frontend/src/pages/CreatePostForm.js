import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/CreatePostForm.css"; // Import your CSS file

function CreatePostForm() {
  // State variables to store form data and error message
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  // React Router hook to navigate programmatically
  const navigate = useNavigate();

  // Effect to check if user is authenticated when component mounts
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      // Redirect to login page if access token does not exist
      navigate("/login");
    }
  }, [navigate]); // Dependency: navigate

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");

      // Set authorization header with access token
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      // Send POST request to create a new post
      const response = await axios.post(
        "http://localhost:8000/posts/create",
        {
          title,
          content,
        },
        { headers }
      );

      // Log response data and navigate to home page
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Failed to create post");
    }
  };

  return (
    <div className="form-container">
      {/* Form title */}
      <h2 className="form-title">Create Post</h2>

      {/* Post form */}
      <form onSubmit={handleSubmit}>
        {/* Title input field */}
        <div className="form-field">
          <label className="form-label">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-post-title"
          />
        </div>

        {/* Content textarea */}
        <div className="form-field">
          <label className="form-label">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-textarea"
          ></textarea>
        </div>

        {/* Display error message if any */}
        {error && <p className="form-error">{error}</p>}

        {/* Submit button */}
        <button type="submit" className="form-button">
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePostForm;
