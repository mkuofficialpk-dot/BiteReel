import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import React from "react";
import axios from "axios";

const UserRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await axios.post(
      "http://localhost:3000/api/auth/user/register",
      {
        fullName: firstName + " " + lastName,
        email,
        password,
      },{
        withCredentials: true
      }
    );
    console.log(response.data);

    navigate("/")

  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Join BiteReel to discover food around you
          </p>
        </div>

        <div className="auth-tabs">
          <button className="auth-tab active">User</button>
          <button
            className="auth-tab"
            onClick={() => navigate("/food-partner/register")}
          >
            Food Partner
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                className="form-input"
                type="text"
                name="firstName"
                placeholder="John"
                autoComplete="given-name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                className="form-input"
                type="text"
                name="lastName"
                placeholder="Doe"
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
            />
          </div>

          <button className="btn-primary" type="submit">
            Create Account
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <button className="auth-link" onClick={() => navigate("/user/login")}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
