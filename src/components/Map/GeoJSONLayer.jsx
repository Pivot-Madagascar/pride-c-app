import React, { useEffect, useState } from 'react'
import { GeoJSON } from 'react-leaflet'

// react-leaflet's GeoJSON does not update when `data` changes, so the layer is
// remounted (new key) whenever one of its inputs changes. `onEachFeature` is
// included because it carries the highlighted org unit (blinking border).
const GeoJSONLayer = ({ data, style, onEachFeature }) => {
    const [updateCount, setUpdateCount] = useState(0)
    useEffect(() => {
        setUpdateCount((prevCount) => prevCount + 1)
    }, [data, style, onEachFeature])
    return (
        <GeoJSON
            key={updateCount}
            data={data}
            style={style}
            onEachFeature={onEachFeature}
        />
    )
}

// Reference equality: the parent memoizes these props, so a cheap comparison
// is enough (the previous JSON.stringify of the whole GeoJSON ran on every
// render and was costly for large geometries).
const areEqual = (prevProps, nextProps) =>
    prevProps.data === nextProps.data &&
    prevProps.style === nextProps.style &&
    prevProps.onEachFeature === nextProps.onEachFeature

const MemoizedGeoJSONLayer = React.memo(GeoJSONLayer, areEqual)
export default MemoizedGeoJSONLayer
