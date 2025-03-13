import React, { useEffect, useState } from 'react'
import { GeoJSON } from 'react-leaflet'
const GeoJSONLayer = ({ data, style, onEachFeature }) => {
    const [updateCount, setUpdateCount] = useState(0)
    useEffect(() => {
        setUpdateCount((prevCount) => prevCount + 1)
    }, [data, style])
    return (
        <GeoJSON
            key={updateCount}
            data={data}
            style={style}
            onEachFeature={onEachFeature}
        />
    )
}
export default GeoJSONLayer
