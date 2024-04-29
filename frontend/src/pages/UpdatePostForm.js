import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
import "../style/UpdatePostForm.css"; // Import your CSS file


function UpdatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { postId } = useParams();

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/posts/${postId}`
      );
      setTitle(response.data.title);
      setContent(response.data.content);
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/posts/update/${postId}`,
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log(response.data);
      alert("Post updated successfully!"); // Display a popup message
      navigate("/"); //
      // Handle successful post update

    } catch (error) {
      console.error(error);
      // Handle post update error
    }
  };

  
  return (
    // <div>
    //   <h2>Update Post</h2>
    //   <form onSubmit={handleSubmit}>
    //     <div>
    //       <label>Title:</label>
    //       <input
    //         type="text"
    //         value={title}
    //         onChange={(e) => setTitle(e.target.value)}
    //       />
    //     </div>
    //     <div>
    //       <label>Content:</label>
    //       <textarea
    //         value={content}
    //         onChange={(e) => setContent(e.target.value)}
    //       ></textarea>
    //     </div>
    //     <button type="submit">Update Post</button>
    //   </form>
    // </div>
    <div className="form-container">
    <h2 className="form-title">Update Post</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label className="form-label">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-post-title"
        />
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
        Update Post
      </button>
    </form>
  </div>
  );
}

export default UpdatePostForm;
