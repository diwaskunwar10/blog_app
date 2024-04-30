import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/CreatePostForm.css"; // Import your CSS file

function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.post(
        "http://localhost:8000/posts/create",
        {
          title,
          content,
        },
        { headers }
      );
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Failed to create post");
    }
  };

  const handleGenerate = async () => {
    if (title.trim() !== "") {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // Add this line
        };
  
        const response = await axios.post(
          "http://localhost:8000/posts/generate",
          { title }, // Send the title as part of the request body
          { headers }
        );
  
        setContent(response.data.generatedContent);
      } catch (error) {
        console.error(error);
        setError("Failed to generate content");
      }
    } else {
      setError("Title field cannot be empty for generation");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-post-title"
          />
          <button
            type="button"
            onClick={handleGenerate}
            className="form-button"
          >
            Generate
          </button>
        </div>
        <div className="form-field">
          <label className="form-label">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-textarea"
          ></textarea>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="form-button">
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePostForm;
