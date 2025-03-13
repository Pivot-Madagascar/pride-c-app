import { useEffect } from 'react'
import { useMapEvents } from 'react-leaflet'

export const useMapEventsHandler = (setMap) => {
    const mapInstance = useMapEvents({
        click: () => {
            mapInstance.locate()
        },
        locationfound: (location) => {
            console.log('location found:', location)
        },
    })

    useEffect(() => {
        setMap(mapInstance)
    }, [mapInstance, setMap])

    return null
}
