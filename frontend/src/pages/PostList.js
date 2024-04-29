import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/PostList.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
    } else {
      fetchPosts();
    }
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/posts/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const postsWithAuthorUsername = response.data.map((post) => ({
        ...post,
        author_username: post.author_username || "Unknown",
      }));
      setPosts(postsWithAuthorUsername);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePost = (postId) => {
    navigate(`/posts/${postId}/update`);
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8000/posts/delete/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSharePost = (postId) => {
    alert(`Sharing post with ID: ${postId}`);
  };

  const toggleMenu = (postId) => {
    setSelectedPostId(selectedPostId === postId ? null : postId);
  };

  
  return (
    <div>
      <h2 className="header">Blog Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="blog-post">
          <div className="author-section">
            <img
              className="author-avatar"
              src={`https://via.placeholder.com/40x40?text=${post.author_username.charAt(0)}`}
alt="Author Avatar"
/>
<span className="author-name">{post.author_username}</span>
<div className="dropdown">
<div className="menu-trigger" onClick={() => toggleMenu(post.id)}>
⋮
</div>
{selectedPostId === post.id && (
<ul className="menu-items">
{post.author_id === parseInt(localStorage.getItem("userId")) && (
<>
<li onClick={() => handleUpdatePost(post.id)}>Update</li>
<li onClick={() => handleDeletePost(post.id)}>Delete</li>
</>
)}
<li onClick={() => handleSharePost(post.id)}>Share</li>
</ul>
)}
</div>
</div>
<h3 className="post-title">{post.title}</h3>
<p className="post-date">{new Date(post.created_at).toLocaleString()}</p>
<p className="post-content">{post.content}</p>
</div>
))}
</div>
);
}
export default PostList;