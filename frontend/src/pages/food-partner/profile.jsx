//profile.jsx
import React, { useState, useEffect } from 'react'
import '../../styles/profile.css'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import defaultAvatar from '../../assets/default-avatar.svg'
const Profile = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [ profile, setProfile ] = useState(null)
    const [ videos, setVideos ] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:3000/api/food-partner/${id}`, { withCredentials: true })
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems)
            })
            .catch(err => {
                if (err.response?.status === 401) navigate('/user/login')
            })
    }, [ id, navigate ])
    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-meta">
                    <img className="profile-avatar" src={profile?.image || defaultAvatar} alt={profile?.name || 'Profile'} />
                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Business name">
                            {profile?.name}
                        </h1>
                        <p className="profile-pill profile-address" title="Address">
                            {profile?.address}
                        </p>
                    </div>
                </div>
                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">total meals</span>
                        <span className="profile-stat-value">{profile?.totalMeals}</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">customer served</span>
                        <span className="profile-stat-value">{profile?.customersServed}</span>
                    </div>
                </div>
            </section>
            <hr className="profile-sep" />
            <section className="profile-grid" aria-label="Videos">
                {videos.map((v) => (
                    <div
                        key={v._id}
                        className="profile-grid-item"
                        onClick={() => navigate(`/food-partner/${id}/reels/${v._id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') navigate(`/food-partner/${id}/reels/${v._id}`)
                        }}
                    >
                        <video
                            className="profile-grid-video"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            src={v.video} muted ></video>
                    </div>
                ))}
            </section>
        </main>
    )
}
export default Profile
