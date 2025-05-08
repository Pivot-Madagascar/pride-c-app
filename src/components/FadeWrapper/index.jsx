import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './style.css'

const FadeWrapper = ({ children }) => {
    const [fadeClass, setFadeClass] = useState('fade-enter')
    const location = useLocation()

    useEffect(() => {
        setFadeClass('fade-enter')
        const timeout = setTimeout(() => setFadeClass('fade-enter-active'), 10)
        return () => clearTimeout(timeout)
    }, [location.pathname])

    return <div className={fadeClass} style={{ display: 'contents' }}>{children}</div>
}

export default FadeWrapper
