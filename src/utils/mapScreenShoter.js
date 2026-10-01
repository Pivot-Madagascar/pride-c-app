import L from 'leaflet'
import 'leaflet-simple-map-screenshoter'
export const setupMapScreenshoter = (
    map,
    onScreenStart,
    onScreenDone,
    onScreenError
) => {
    const screenshotter = L.simpleMapScreenshoter().addTo(map)
    
    map.on('simpleMapScreenshoter.takeScreen', () => {
        onScreenStart()
    })
    map.on('simpleMapScreenshoter.done', () => {
        onScreenDone()
    })
    map.on('simpleMapScreenshoter.error', (event) => {
        onScreenError(event.e)
    })
    return screenshotter 
}
