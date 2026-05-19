import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import axios from "axios";

const UserLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await axios.post(
      "http://localhost:3000/api/auth/user/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );
    console.log(response.data);

    navigate("/")
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">Welcome back to BiteReel</p>
        </div>

        <div className="auth-tabs">
          <button className="auth-tab active">User</button>
          <button
            className="auth-tab"
            onClick={() => navigate("/food-partner/login")}
          >
            Food Partner
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="Your password"
              autoComplete="current-password"
            />
          </div>

          <button className="btn-primary" type="submit">
            Sign In
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <button
            className="auth-link"
            onClick={() => navigate("/user/register")}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
