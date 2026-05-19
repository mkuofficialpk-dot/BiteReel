import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reels.css";

const MuteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </svg>
);

const UnmuteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);

const ReelItem = forwardRef(function ReelItem({ reel, onVisible }, ref) {
  const [muted, setMuted] = useState(true);
  const [visible, setVisible] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const setRefs = (el) => {
    containerRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setVisible(isVisible);
        if (isVisible) {
          videoRef.current?.play().catch(() => {});
          onVisible?.();
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.65 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  const partnerName =
    reel.foodPartner && typeof reel.foodPartner === "object"
      ? reel.foodPartner.name
      : null;

  const partnerId =
    reel.foodPartner && typeof reel.foodPartner === "object"
      ? reel.foodPartner._id
      : reel.foodPartner;

  const handleVisitStore = () => {
    if (partnerId) navigate(`/food-partner/${partnerId}`);
  };

  return (
    <article
      className={`reel-item${visible ? " reel-visible" : ""}`}
      ref={setRefs}
      aria-label={reel.name}
    >
      <video
        ref={videoRef}
        src={reel.video}
        className="reel-video"
        loop
        muted={muted}
        playsInline
        preload="metadata"
        aria-label={reel.description}
      />

      <button
        className="mute-btn"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute video" : "Mute video"}
        type="button"
      >
        {muted ? <MuteIcon /> : <UnmuteIcon />}
      </button>

      <div className="reel-gradient" aria-hidden="true" />

      <div className="reel-overlay">
        {partnerName && <span className="reel-partner">{partnerName}</span>}
        <h2 className="reel-name">{reel.name}</h2>
        <p className="reel-description">{reel.description}</p>
        <button className="visit-btn" onClick={handleVisitStore} type="button">
          Visit Store
        </button>
      </div>
    </article>
  );
});

const ReelFeed = ({ items, emptyMessage }) => {
  const [, setCurrentIndex] = useState(0);
  const reelRefs = useRef([]);

  const scrollToIndex = useCallback((index) => {
    reelRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCurrentIndex((prev) => {
          const next = Math.min(prev + 1, items.length - 1);
          scrollToIndex(next);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCurrentIndex((prev) => {
          const next = Math.max(prev - 1, 0);
          scrollToIndex(next);
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length, scrollToIndex]);

  return (
    <div className="home-page">
      <div className="feed" role="feed" aria-label="Food reels">
        {items.length === 0 ? (
          <div className="feed-empty">{emptyMessage}</div>
        ) : (
          items.map((reel, index) => (
            <ReelItem
              key={reel._id}
              reel={reel}
              ref={(el) => {
                reelRefs.current[index] = el;
              }}
              onVisible={() => setCurrentIndex(index)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ReelFeed;
