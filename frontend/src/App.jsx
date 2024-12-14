import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/login";
import Signup from "./pages/Auth/signup";
import Home from './pages/Home/home';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" exact element={<Root />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<Signup />} />
        </Routes>
      </Router>
    </div>
  )
}

// root component to handle the initial redirect
const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
export default App