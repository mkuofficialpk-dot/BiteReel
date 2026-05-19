import React, { useState, useEffect } from 'react'
import '../../styles/dashboard.css'
import axios from 'axios'

const AVATAR_URL =
    'https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D'

/* ─────────────────────────── Upload bottom sheet ─────────────────────────── */
const UploadSheet = ({ open, onClose, onSuccess }) => {
    const [file, setFile] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const reset = () => {
        setFile(null)
        setName('')
        setDescription('')
        setError('')
        setLoading(false)
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) handleClose()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) return
        setLoading(true)
        setError('')

        const formData = new FormData()
        formData.append('foodItem', file)
        formData.append('name', name)
        formData.append('description', description)

        try {
            await axios.post('http://localhost:3000/api/food/', formData, {
                withCredentials: true,
            })
            reset()
            onSuccess()
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div
            className={`dashboard-sheet-backdrop${open ? ' open' : ''}`}
            onClick={handleBackdrop}
        >
            <div className="dashboard-sheet">
                <div className="dashboard-sheet-handle" aria-hidden="true" />
                <button
                    className="dashboard-sheet-close"
                    type="button"
                    onClick={handleClose}
                    aria-label="Close upload sheet"
                >
                    ×
                </button>
                <h2 className="dashboard-sheet-title">Add Food Item</h2>

                <form onSubmit={handleSubmit}>
                    <div className="dashboard-form-field">
                        <span className="dashboard-form-label">Video file</span>
                        <label className="dashboard-file-input">
                            <input
                                type="file"
                                accept="video/*"
                                style={{ display: 'none' }}
                                onChange={e => setFile(e.target.files[0] || null)}
                            />
                            {file
                                ? <span className="dashboard-file-chip">✓ {file.name}</span>
                                : <span>📁 Choose video file</span>
                            }
                        </label>
                    </div>

                    <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Name</label>
                        <input
                            className="dashboard-form-input"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Spicy Chicken Burger"
                            required
                        />
                    </div>

                    <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Description</label>
                        <textarea
                            className="dashboard-form-textarea"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Describe your food item..."
                            rows={3}
                        />
                    </div>

                    {error && <p className="dashboard-form-error">{error}</p>}

                    <button
                        className="dashboard-submit-btn"
                        type="submit"
                        disabled={loading || !file || !name}
                    >
                        {loading ? 'Uploading...' : 'Upload Food'}
                    </button>
                </form>
            </div>
        </div>
    )
}

/* ─────────────────────────── Dashboard page ──────────────────────────────── */
const Dashboard = () => {
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])
    const [sheetOpen, setSheetOpen] = useState(false)

    const fetchData = () => {
        axios.get('http://localhost:3000/api/food-partner/me', { withCredentials: true })
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems)
            })
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-meta">
                    <div className="dashboard-avatar-wrap">
                        <img className="profile-avatar" src={AVATAR_URL} alt="" />
                        <button
                            className="dashboard-avatar-edit"
                            type="button"
                            onClick={() => alert('Edit profile — coming soon!')}
                            aria-label="Edit profile"
                        >
                            ✏️
                        </button>
                    </div>
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

                <button
                    className="dashboard-add-btn"
                    type="button"
                    onClick={() => setSheetOpen(true)}
                >
                    <span className="dashboard-add-btn-icon" aria-hidden="true">+</span>
                    Add Food Item
                </button>
            </section>

            <hr className="profile-sep" />

            <section className="profile-grid" aria-label="Videos">
                {videos.map((v) => (
                    <div key={v.id} className="profile-grid-item">
                        <video
                            className="profile-grid-video"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            src={v.video}
                            muted
                        ></video>
                    </div>
                ))}
            </section>

            <UploadSheet
                open={sheetOpen}
                onClose={() => setSheetOpen(false)}
                onSuccess={fetchData}
            />
        </main>
    )
}

export default Dashboard
