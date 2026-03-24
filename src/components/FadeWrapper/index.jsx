import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Inline styles to avoid CSS import issues in Jest
const styles = {
    enter: {
        opacity: 0,
        transition: 'opacity 0.3s ease-in',
    },
    enterActive: {
        opacity: 1,
    },
}

const FadeWrapper = ({ children }) => {
    const [isActive, setIsActive] = useState(false)
    const location = useLocation()

    useEffect(() => {
        setIsActive(false)
        const timeout = setTimeout(() => setIsActive(true), 10)
        return () => clearTimeout(timeout)
    }, [location.pathname])

    const fadeStyle = isActive ? styles.enterActive : styles.enter

    return <div style={{ ...fadeStyle, display: 'contents' }}>{children}</div>
}

export default FadeWrapper
