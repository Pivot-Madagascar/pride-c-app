import React, { useState, useEffect } from 'react'

const ExpandMore = ({ height = 15, width = 9, color = '#343B4F' }) => {
    const [currentColor, setCurrentColor] = useState(color)
    useEffect(() => {
        setCurrentColor(color)
    }, [color])
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 9 15"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.78486 8.31095C7.98014 8.11494 8.08984 7.84912 8.08984 7.57195C8.08984 7.29479 7.98014 7.02897 7.78486 6.83296L1.89215 0.919927C1.69569 0.729525 1.43256 0.624168 1.15944 0.62655C0.886318 0.628931 0.625054 0.738861 0.431921 0.93266C0.238787 1.12646 0.129237 1.38862 0.126863 1.66269C0.12449 1.93675 0.229484 2.20078 0.419232 2.39792L5.57548 7.57195L0.419232 12.746C0.229484 12.9431 0.12449 13.2072 0.126863 13.4812C0.129237 13.7553 0.238787 14.0174 0.431921 14.2112C0.625054 14.405 0.886318 14.515 1.15944 14.5174C1.43256 14.5197 1.69569 14.4144 1.89215 14.224L7.78486 8.31095Z"
                fill={currentColor}
            />
        </svg>
    )
}



export default ExpandMore
