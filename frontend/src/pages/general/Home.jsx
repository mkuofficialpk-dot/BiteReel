import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'
import BottomNav from '../../components/BottomNav'

const Home = () => {
    const [videos, setVideos] = useState([])
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
            <ReelFeed foods={videos} />
            <BottomNav />
        </>
    )
}
export default Home
