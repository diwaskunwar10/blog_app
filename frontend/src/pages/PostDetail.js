import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function PostDetail() {
  const [post, setPost] = useState(null);
  const { postId } = useParams();

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/posts/${postId}`
      );
      setPost(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </div>
  );
}

export default PostDetail;