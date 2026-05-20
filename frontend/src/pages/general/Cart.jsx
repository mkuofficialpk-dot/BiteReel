import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNav from "../../components/BottomNav";
import "../../styles/cart.css";

const TrashIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const CartBagIcon = () => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/cart", { withCredentials: true })
      .then((res) => setItems(res.data.items))
      .catch((err) => {
        if (err.response?.status === 401) navigate("/user/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleRemove = async (foodId) => {
    const prev = items;
    setItems(items.filter((item) => item.food._id !== foodId));
    try {
      await axios.post(
        "http://localhost:3000/api/cart/remove",
        { foodId },
        { withCredentials: true }
      );
    } catch {
      setItems(prev);
    }
  };

  const total = items.reduce((sum, item) => sum + (item.food?.price || 0), 0);

  return (
    <main className="cart-page">
      <header className="cart-header">
        <button
          className="cart-back-btn"
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="cart-heading">Your Basket</h1>
        {!loading && items.length > 0 && (
          <span className="cart-count">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        )}
      </header>

      {loading ? (
        <div className="cart-state">
          <p className="cart-state-label">Loading...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <CartBagIcon />
          </div>
          <h2 className="cart-empty-title">Your basket is empty</h2>
          <p className="cart-empty-subtitle">
            Add something delicious from the reels
          </p>
          <button
            className="cart-browse-btn"
            type="button"
            onClick={() => navigate("/")}
          >
            Browse Food
          </button>
        </div>
      ) : (
        <>
          <section className="cart-list" aria-label="Cart items">
            {items.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-thumb">
                  <video
                    src={item.food.video}
                    muted
                    playsInline
                    preload="metadata"
                    className="cart-item-video"
                  />
                </div>
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.food.name}</p>
                  {item.food.foodPartner?.name && (
                    <p className="cart-item-partner">
                      {item.food.foodPartner.name}
                    </p>
                  )}
                  <p className="cart-item-price">PKR {item.food.price || 0}</p>
                </div>
                <button
                  className="cart-item-remove"
                  type="button"
                  onClick={() => handleRemove(item.food._id)}
                  aria-label="Remove item"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </section>

          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">PKR {total}</span>
            </div>
            <button className="cart-checkout-btn" type="button">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      <BottomNav />
    </main>
  );
};

export default Cart;
