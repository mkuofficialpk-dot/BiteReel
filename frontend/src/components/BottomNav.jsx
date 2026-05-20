import { Link, useLocation } from "react-router-dom";
import "../styles/bottom-nav.css";

const HomeIcon = ({ active }) =>
  active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  ) : (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

const BookmarkNavIcon = ({ active }) =>
  active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
    </svg>
  ) : (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <Link
        to="/"
        className={`bottom-nav-tab${pathname === "/" ? " active" : ""}`}
        aria-label="Home"
      >
        <HomeIcon active={pathname === "/"} />
        <span className="bottom-nav-label">Home</span>
      </Link>
      <Link
        to="/saved"
        className={`bottom-nav-tab${pathname === "/saved" ? " active" : ""}`}
        aria-label="Saved"
      >
        <BookmarkNavIcon active={pathname === "/saved"} />
        <span className="bottom-nav-label">Saved</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
