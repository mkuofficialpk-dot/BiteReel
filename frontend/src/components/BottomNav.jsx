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

const CartIcon = ({ active }) =>
  active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h11v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.45 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
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
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
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
      <Link
        to="/cart"
        className={`bottom-nav-tab${pathname === "/cart" ? " active" : ""}`}
        aria-label="Cart"
      >
        <CartIcon active={pathname === "/cart"} />
        <span className="bottom-nav-label">Cart</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
