import { useEffect } from 'react'
import { useMapEvents } from 'react-leaflet'

export const useMapEventsHandler = (setMap) => {
    const mapInstance = useMapEvents({
        click: () => {
            mapInstance.locate()
        }
    })

    useEffect(() => {
        setMap(mapInstance)
    }, [mapInstance, setMap])

    return null
}
