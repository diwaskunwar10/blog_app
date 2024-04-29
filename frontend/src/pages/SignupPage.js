import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import the Link component and useNavigate hook

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true); // State to track email validity
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/users/signup", {
        username,
        email,
        password,
      });
      console.log(response.data);
      // Handle successful signup
      navigate("/login");

    } catch (error) {
      console.error(error);
      // Handle signup error
      
    }
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(value));
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Signup</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className="input">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange} // Use the handleEmailChange function for email input change
            className={isValidEmail ? "" : "invalid"} // Apply invalid class if email is not valid
          />
          {!isValidEmail && <p className="error">Please enter a valid email address</p>} {/* Display error message if email is not valid */}
        </div>
        <div className="input">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Signup</button>
        <Link to="/login">
          <button type="button">Login</button>
        </Link>
      </form>
    </div>
  );
}


export default SignupPage;
