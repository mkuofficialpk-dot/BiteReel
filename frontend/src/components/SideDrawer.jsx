import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/side-drawer.css'
import defaultAvatar from '../assets/default-avatar.svg'

/* ── SVG icons ── */
const ProfileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const SavedIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

const OrdersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

/* ── SideDrawer ── */
const SideDrawer = ({ open, onClose, role, profile }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleLogout = async () => {
    const url = role === 'user'
      ? 'http://localhost:3000/api/auth/user/logout'
      : 'http://localhost:3000/api/auth/food-partner/logout'
    try {
      await axios.get(url, { withCredentials: true })
    } catch (err) {
      console.error('Logout error:', err)
    }
    onClose()
    navigate(role === 'user' ? '/user/login' : '/food-partner/login')
  }

  const displayName = profile?.name || profile?.fullName || null
  const displaySub = role === 'user' ? profile?.email : profile?.address

  return (
    <div
      className={`drawer-backdrop${open ? ' open' : ''}`}
      onClick={handleBackdrop}
      aria-hidden={!open}
    >
      <div className="drawer-panel" role="dialog" aria-modal="true">

        {/* Profile header */}
        <div className="drawer-profile">
          <img
            className="drawer-avatar"
            src={profile?.image || defaultAvatar}
            alt={displayName || 'Profile'}
          />
          <div className="drawer-profile-info">
            {displayName && <span className="drawer-name">{displayName}</span>}
            {displaySub && <span className="drawer-sub">{displaySub}</span>}
          </div>
        </div>

        <div className="drawer-divider" />

        {/* Menu items */}
        <nav className="drawer-menu">
          {role === 'user' ? (
            <>
              <button
                className="drawer-item"
                type="button"
                onClick={() => { onClose(); navigate('/user/profile') }}
              >
                <span className="drawer-item-icon"><ProfileIcon /></span>
                <span className="drawer-item-label">View Profile</span>
                <span className="drawer-item-chevron"><ChevronIcon /></span>
              </button>

              <button
                className="drawer-item"
                type="button"
                onClick={() => { onClose(); navigate('/saved') }}
              >
                <span className="drawer-item-icon"><SavedIcon /></span>
                <span className="drawer-item-label">Saved</span>
                <span className="drawer-item-chevron"><ChevronIcon /></span>
              </button>

              <div className="drawer-divider" />

              <button
                className="drawer-item drawer-item--logout"
                type="button"
                onClick={handleLogout}
              >
                <span className="drawer-item-icon"><LogoutIcon /></span>
                <span className="drawer-item-label">Logout</span>
              </button>
            </>
          ) : (
            <>
              <div className="drawer-item drawer-item--disabled">
                <span className="drawer-item-icon"><OrdersIcon /></span>
                <div className="drawer-item-content">
                  <span className="drawer-item-label">View Orders</span>
                  <span className="drawer-item-sub">Coming soon</span>
                </div>
              </div>

              <div className="drawer-divider" />

              <button
                className="drawer-item drawer-item--logout"
                type="button"
                onClick={handleLogout}
              >
                <span className="drawer-item-icon"><LogoutIcon /></span>
                <span className="drawer-item-label">Logout</span>
              </button>
            </>
          )}
        </nav>

        <div className="drawer-footer">v1.0.0</div>
      </div>
    </div>
  )
}

export default SideDrawer
