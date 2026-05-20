import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'
import defaultAvatar from '../../assets/default-avatar.svg'
import '../../styles/partner-reels.css'

const PartnerReels = () => {
  const { partnerId, foodId } = useParams()
  const navigate = useNavigate()
  const [partner, setPartner] = useState(null)
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/food-partner/${partnerId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setPartner(res.data.foodPartner)
        setFoods(res.data.foodPartner.foodItems || [])
      })
      .catch((err) => {
        if (err.response?.status === 401) navigate('/user/login')
      })
      .finally(() => setLoading(false))
  }, [partnerId, navigate])

  const header = (
    <div className="partner-reels-header">
      <button
        className="partner-reels-back"
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="partner-reels-badge"
        type="button"
        onClick={() => navigate(`/food-partner/${partnerId}`)}
        aria-label="View store profile"
      >
        <img
          className="partner-reels-avatar"
          src={partner?.image || defaultAvatar}
          alt=""
        />
        <span className="partner-reels-name">
          {partner?.name || 'Loading...'}
        </span>
      </button>
    </div>
  )

  if (loading) {
    return <div className="partner-reels-loading">Loading...</div>
  }

  if (!foods.length) {
    return (
      <div className="partner-reels-empty">
        <p>This partner has no videos yet.</p>
        <button type="button" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    )
  }

  return (
    <ReelFeed
      foods={foods}
      initialFoodId={foodId}
      headerSlot={header}
    />
  )
}

export default PartnerReels
