import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import BottomNav from "../../components/BottomNav";
import "../../styles/saved.css";

const Saved = () => {
  const [savedFoods, setSavedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/food/saved")
      .then((res) => setSavedFoods(res.data.savedFoods))
      .catch((err) => {
        if (err.response?.status === 401) navigate("/user/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <main className="saved-page">
      <header className="saved-header">
        <h1 className="saved-title">Saved</h1>
        {!loading && (
          <p className="saved-count">
            {savedFoods.length}{" "}
            {savedFoods.length === 1 ? "saved food" : "saved foods"}
          </p>
        )}
      </header>

      {loading ? (
        <div className="saved-empty">
          <p className="saved-empty-title">Loading...</p>
        </div>
      ) : savedFoods.length === 0 ? (
        <div className="saved-empty">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <p className="saved-empty-title">No saved foods yet</p>
          <span className="saved-empty-hint">
            Tap the bookmark on any reel to save it here
          </span>
        </div>
      ) : (
        <section className="saved-grid" aria-label="Saved foods">
          {savedFoods.map((food) => (
            <div key={food._id} className="saved-grid-item">
              <video
                className="saved-grid-video"
                src={food.video}
                muted
                playsInline
                preload="metadata"
              />
            </div>
          ))}
        </section>
      )}

      <BottomNav />
    </main>
  );
};

export default Saved;
