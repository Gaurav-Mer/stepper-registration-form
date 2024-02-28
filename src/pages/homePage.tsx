import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const naviate = useNavigate()
    useEffect(() => {
        naviate("/register")
    }, [])
    return (
        <div>
            I am home page
        </div>
    )
}

export default HomePage;
