//Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/dashboard.css'
import axios from 'axios'
import defaultAvatar from '../../assets/default-avatar.svg'
import HamburgerButton from '../../components/HamburgerButton'
import SideDrawer from '../../components/SideDrawer'

/* ─────────────────────────── Add Food bottom sheet ──────────────────────── */
const UploadSheet = ({ open, onClose, onSuccess }) => {
    const [file, setFile] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const reset = () => {
        setFile(null)
        setName('')
        setDescription('')
        setPrice('')
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
        formData.append('price', price)

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

                    <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Price (PKR)</label>
                        <input
                            className="dashboard-form-input"
                            type="number"
                            min="0"
                            step="1"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder="e.g. 450"
                            required
                        />
                    </div>

                    {error && <p className="dashboard-form-error">{error}</p>}

                    <button
                        className="dashboard-submit-btn"
                        type="submit"
                        disabled={loading || !file || !name || !price}
                    >
                        {loading ? 'Uploading...' : 'Upload Food'}
                    </button>
                </form>
            </div>
        </div>
    )
}

/* ─────────────────────────── Edit Profile bottom sheet ──────────────────── */
const EditSheet = ({ open, onClose, profile, onSuccess }) => {
    const [form, setForm] = useState({ name: '', address: '', contactName: '', phone: '' })
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')

    // Pre-fill controlled inputs whenever the sheet opens with fresh profile data
    useEffect(() => {
        if (open && profile) {
            setForm({
                name: profile.name || '',
                address: profile.address || '',
                contactName: profile.contactName || '',
                phone: profile.phone || '',
            })
        }
    }, [open, profile])

    // Revoke the object URL when imagePreview changes (and on unmount)
    // — prevents memory leaks from repeated image selections
    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview)
        }
    }, [imagePreview])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImage(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleClose = () => {
        setImage(null)
        setImagePreview(null)
        setError('')
        onClose()
    }

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) handleClose()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        setError('')

        const formData = new FormData()
        Object.entries(form).forEach(([key, val]) => {
            if (val.trim()) formData.append(key, val.trim())
        })
        if (image) formData.append('image', image)

        try {
            await axios.patch('http://localhost:3000/api/food-partner/me', formData, {
                withCredentials: true,
            })
            setImage(null)
            setImagePreview(null)
            onSuccess()
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save. Please try again.')
        } finally {
            setIsSaving(false)
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
                    aria-label="Close edit sheet"
                >
                    ×
                </button>
                <h2 className="dashboard-sheet-title">Edit Profile</h2>

                <form onSubmit={handleSubmit}>
                    <div className="dashboard-form-field">
                        <span className="dashboard-form-label">Profile image</span>
                        <label className="dashboard-file-input">
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                            <span className="dashboard-image-row">
                                <img
                                    className="dashboard-image-preview"
                                    src={image ? imagePreview : (profile?.image || defaultAvatar)}
                                    alt="Profile preview"
                                />
                                <span className="dashboard-file-chip">
                                    {image ? `✓ ${image.name}` : '📷 Change profile image'}
                                </span>
                            </span>
                        </label>
                    </div>

                    <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Business name</label>
                        <input
                            className="dashboard-form-input"
                            type="text"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="Spice & Co."
                        />
                    </div>

                    <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Address</label>
                        <input
                            className="dashboard-form-input"
                            type="text"
                            value={form.address}
                            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                            placeholder="Street, City, Country"
                        />
                    </div>

                    <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Contact name</label>
                        <input
                            className="dashboard-form-input"
                            type="text"
                            value={form.contactName}
                            onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                            placeholder="Ahmed Khan"
                        />
                    </div>

                    <div className="dashboard-form-field">
                        <label className="dashboard-form-label">Phone</label>
                        <input
                            className="dashboard-form-input"
                            type="tel"
                            value={form.phone}
                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            placeholder="+92 300 0000000"
                        />
                    </div>

                    {error && <p className="dashboard-form-error">{error}</p>}

                    <button
                        className="dashboard-submit-btn"
                        type="submit"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    )
}

/* ─────────────────────────── Dashboard page ──────────────────────────────── */
const Dashboard = () => {
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])
    const [sheetOpen, setSheetOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)

    const fetchData = () => {
        axios.get('http://localhost:3000/api/food-partner/me', { withCredentials: true })
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems)
            })
            .catch(err => {
                if (err.response?.status === 401) navigate('/food-partner/login')
            })
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-meta">
                    <div className="dashboard-avatar-wrap">
                        <img
                            className="profile-avatar"
                            src={profile?.image || defaultAvatar}
                            alt=""
                        />
                        <button
                            className="dashboard-avatar-edit"
                            type="button"
                            onClick={() => setIsEditOpen(true)}
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
                    <div key={v._id} className="profile-grid-item">
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

            <EditSheet
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                profile={profile}
                onSuccess={fetchData}
            />
            <HamburgerButton onClick={() => setDrawerOpen(true)} />
            <SideDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                role="partner"
                profile={profile}
            />
        </main>
    )
}

export default Dashboard
