import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import BottomNav from '../../components/BottomNav'

const Home = () => {
    const [videos, setVideos] = useState([])
    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {
                setVideos(response.data.foodItems)
            })
            .catch(() => {})
    }, [])
    return (
        <>
            <ReelFeed items={videos} emptyMessage="No videos available." />
            <BottomNav />
        </>
    )
}
export default Home
