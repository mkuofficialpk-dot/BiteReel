import '../styles/side-drawer.css'

const HamburgerButton = ({ onClick }) => (
  <button
    className="hamburger-btn"
    type="button"
    onClick={onClick}
    aria-label="Open menu"
  >
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      aria-hidden="true"
    >
      <rect width="18" height="2" rx="1" fill="currentColor" />
      <rect y="6" width="18" height="2" rx="1" fill="currentColor" />
      <rect y="12" width="18" height="2" rx="1" fill="currentColor" />
    </svg>
  </button>
)

export default HamburgerButton
