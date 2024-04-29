import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../style/Login.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        username,
        password,
      });
      const { access_token } = response.data;
      // Store the access token and user ID in local storage
      localStorage.setItem("accessToken", access_token);

      // Parse the token to get the user ID
      const payload = JSON.parse(atob(access_token.split(".")[1]));
      const userId = payload.user_id;
      localStorage.setItem("userId", userId);

      // Redirect to the home page or any other desired location
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Invalid username or password.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="forgot-password">
          forgot password ? <span>Click Here</span>
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit">Login</button>
        <Link to="/signup">
          <button type="button">Signup</button>
        </Link>
      </form>
    </div>
  );
}

export default LoginPage;