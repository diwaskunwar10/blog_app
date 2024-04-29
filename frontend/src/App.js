import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PostList from "./pages/PostList";
import PostDetail from "./pages/PostDetail";
import CreatePostForm from "./pages/CreatePostForm";
import UpdatePostForm from "./pages/UpdatePostForm";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/posts/create" element={<CreatePostForm />} />
          <Route path="/posts/:postId/update" element={<UpdatePostForm />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/" element={<PostList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;