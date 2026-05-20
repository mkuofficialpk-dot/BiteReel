import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import '../../styles/cart.css'

const CartBagIcon = () => (
  <svg
    width="80"
    height="80"
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
)

const Cart = () => {
  const navigate = useNavigate()

  return (
    <main className="cart-page">
      <div className="cart-empty">
        <div className="cart-empty-icon">
          <CartBagIcon />
        </div>
        <h2 className="cart-empty-title">Your cart is empty</h2>
        <p className="cart-empty-subtitle">
          Cart feature coming soon. We're working on it!
        </p>
        <button
          className="cart-browse-btn"
          type="button"
          onClick={() => navigate('/')}
        >
          Browse food
        </button>
      </div>
      <BottomNav />
    </main>
  )
}

export default Cart
