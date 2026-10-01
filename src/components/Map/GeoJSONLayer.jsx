import React, { useEffect, useState } from 'react'
import { GeoJSON } from 'react-leaflet'
const GeoJSONLayer = React.memo(({ data, style, onEachFeature }) => {
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
})

const areEqual = (prevProps, nextProps) => {
    return (
        JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
        JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style) &&
        prevProps.onEachFeature === nextProps.onEachFeature
    )
}
const MemoizedGeoJSONLayer = React.memo(GeoJSONLayer, areEqual)
export default MemoizedGeoJSONLayer
