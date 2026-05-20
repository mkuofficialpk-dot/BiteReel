import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import BottomNav from '../../components/BottomNav'
import HamburgerButton from '../../components/HamburgerButton'
import SideDrawer from '../../components/SideDrawer'

const Home = () => {
    const [videos, setVideos] = useState([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => { setVideos(response.data.foodItems) })
            .catch(err => {
                if (err.response?.status === 401) navigate('/user/login')
            })
    }, [navigate])

    return (
        <>
            <ReelFeed items={videos} emptyMessage="No videos available." />
            <HamburgerButton onClick={() => setDrawerOpen(true)} />
            <BottomNav />
            <SideDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                role="user"
                profile={null}
            />
        </>
    )
}
export default Home
