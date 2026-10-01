import React from 'react'
import { useMapEvents } from 'react-leaflet'

const MapEventsHandler = ({ setMap }) => {
    const mapInstance = useMapEvents({
        click: () => {
            mapInstance.locate()
        }
    })

    React.useEffect(() => {
        setMap(mapInstance)
    }, [mapInstance, setMap])

    return null
}

export default MapEventsHandler
