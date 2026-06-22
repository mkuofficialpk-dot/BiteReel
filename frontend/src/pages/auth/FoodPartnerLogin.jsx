import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import api from "../../api";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await api.post("/api/auth/food-partner/login", {
      email,
      password,
    });

    console.log(response.data);
    navigate("/food-partner/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Partner Sign In</h1>
          <p className="auth-subtitle">Access your partner dashboard</p>
        </div>

        <div className="auth-tabs">
          <button className="auth-tab" onClick={() => navigate("/user/login")}>
            User
          </button>
          <button className="auth-tab active">Food Partner</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="partner@example.com"
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
          Not a partner yet?{" "}
          <button className="auth-link" onClick={() => navigate("/food-partner/register")}>
            Register your business
          </button>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
