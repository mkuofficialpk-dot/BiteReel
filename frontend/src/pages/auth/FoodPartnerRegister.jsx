import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import axios from "axios";


const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const businessName = e.target.businessName.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;
    const email = e.target.email.value;
    const address = e.target.address.value;
    const password = e.target.password.value;

    const response = await axios.post("http://localhost:3000/api/auth/food-partner/register", {
      name: businessName,
      contactName,
      phone,
      email,
      address,
      password,
    }, {
      withCredentials: true
    })

    console.log(response.data);

    navigate("/food-partner/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <div className="auth-header">
          <h1 className="auth-title">Partner Registration</h1>
          <p className="auth-subtitle">List your business on BiteReel</p>
        </div>

        <div className="auth-tabs">
          <button className="auth-tab" onClick={() => navigate("/user/register")}>
            User
          </button>
          <button className="auth-tab active">Food Partner</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Business Name</label>
              <input
                className="form-input"
                type="text"
                name="businessName"
                placeholder="Spice & Co."
                autoComplete="organization"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Name</label>
              <input
                className="form-input"
                type="text"
                name="contactName"
                placeholder="Ahmed Khan"
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-input"
                type="tel"
                name="phone"
                placeholder="+92 300 0000000"
                autoComplete="tel"
              />
            </div>
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
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              className="form-input"
              type="text"
              name="address"
              placeholder="Street, City, Country"
              autoComplete="street-address"
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
            Register Business
          </button>
        </form>

        <p className="auth-footer">
          Already registered?{" "}
          <button className="auth-link" onClick={() => navigate("/food-partner/login")}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
