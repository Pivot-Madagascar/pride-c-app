import React, { useState, useEffect } from 'react'

const Menu = ({ height, width, color }) => {
    const [currentColor, setCurrentColor] = useState(color)
    useEffect(() => {
        setCurrentColor(color)
    }, [color])
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 240 240"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M40 130C45.5228 130 50 125.523 50 120C50 114.477 45.5228 110 40 110C34.4772 110 30 114.477 30 120C30 125.523 34.4772 130 40 130Z"
                fill={currentColor}
                />
            <path
                d="M200.6 110H79.4C74.2085 110 70 114.209 70 119.4V120.6C70 125.791 74.2085 130 79.4 130H200.6C205.791 130 210 125.791 210 120.6V119.4C210 114.209 205.791 110 200.6 110Z"
                fill={currentColor}
            />
            <path
                d="M200.6 160H39.4C34.2085 160 30 164.209 30 169.4V170.6C30 175.791 34.2085 180 39.4 180H200.6C205.791 180 210 175.791 210 170.6V169.4C210 164.209 205.791 160 200.6 160Z"
                fill={currentColor}
            />
            <path
                d="M200.6 60H39.4C34.2085 60 30 64.2085 30 69.4V70.6C30 75.7915 34.2085 80 39.4 80H200.6C205.791 80 210 75.7915 210 70.6V69.4C210 64.2085 205.791 60 200.6 60Z"
                fill={currentColor}
            />
        </svg>
    )
}

Menu.defaultProps = {
    height: 240,
    width: 240,
    color: '#343B4F',
}

export default Menu
