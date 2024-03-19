import React, { useState, useEffect } from 'react'

const ExpandMore = ({ height, width, color }) => {
    const [currentColor, setCurrentColor] = useState(color)
    useEffect(() => {
        setCurrentColor(color)
    }, [color])
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 15 9"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.36935 7.77582C6.56536 7.97111 6.83118 8.08081 7.10835 8.08081C7.38551 8.08081 7.65133 7.97111 7.84734 7.77582L13.7604 1.88312C13.9508 1.68666 14.0561 1.42353 14.0537 1.15041C14.0514 0.877285 13.9414 0.616021 13.7476 0.422888C13.5538 0.229754 13.2917 0.120203 13.0176 0.11783C12.7435 0.115457 12.4795 0.220451 12.2824 0.410199L7.10835 5.56645L1.93431 0.410199C1.73718 0.220451 1.47314 0.115457 1.19908 0.11783C0.925015 0.120203 0.662851 0.229754 0.469052 0.422888C0.275252 0.616021 0.165324 0.877285 0.162942 1.15041C0.160561 1.42353 0.265917 1.68666 0.456319 1.88312L6.36935 7.77582Z"
                fill={currentColor}
            />
        </svg>
    )
}

ExpandMore.defaultProps = {
    height: 9,
    width: 15,
    color: '#343B4F',
}

export default ExpandMore
