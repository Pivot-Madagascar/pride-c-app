import React, { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet'
import { addOrgUnitNameToFeatures, groupByPeriod } from '../../utils/formatting'
import 'leaflet/dist/leaflet.css'
import style from './Map.module.scss'
import MapLegend from './MapLegend'
import L from 'leaflet'

const center = [-21.0347, 47.6111]
const initialZoom = 9

const Map = ({
    data,
    colors,
    periodId,
    adminDivisionType,
    highlightedOrgUnitIds = [],
    highlightedStrokeColor = 'blue',
    highlightedStrokeWidth = '4px',
    sectoGeoData,
    onClick,
}) => {
    const [map, setMap] = useState(null)
    const [initialLayerStates, setInitialLayerStates] = useState([])

    const resetZoom = () => {
        if (map) {
            map.eachLayer((layer) => {
                layer.closePopup()
            })

            initialLayerStates.forEach(({ id, style, pathClass }) => {
                const layer = L.geoJSON(
                    geoData.features.find((f) => f.properties.orgUnit_id === id)
                )
                layer.setStyle(style) 
                if (layer._path) {
                    layer._path.className = pathClass 
                }
                layer.addTo(map) 
            })

            map.setView(center, initialZoom)
        }
    }

    useEffect(() => {
        resetZoom()
    }, [adminDivisionType])

    const geoData = useMemo(() => {
        if (data && sectoGeoData) {
            const features = addOrgUnitNameToFeatures(
                sectoGeoData.features,
                groupByPeriod(data)[periodId]
            )
            return {
                type: 'FeatureCollection',
                features: features,
            }
        }
        return null
    }, [data, periodId, sectoGeoData])

    const [minValue, maxValue] = useMemo(() => {
        if (geoData) {
            const values = geoData.features
                .filter((feature) => feature.properties.value !== undefined)
                .map((feature) => feature.properties.value)
            return [Math.min(...values), Math.max(...values)]
        }
        return [0, 0]
    }, [geoData])

    const MapEvents = () => {
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
        }, [mapInstance])

        return null
    }

    const zoomToFeature = (e) => {
        if (map) {
            const target = e.target
            onClick(target.feature.properties)
            map.fitBounds(target.getBounds())
        }
    }

    const zoomToHighlightedUnits = () => {
        if (map && geoData) {
            const highlightedLayers = []
            geoData.features.forEach((feature) => {
                const layer = L.geoJSON(feature)
                if (
                    highlightedOrgUnitIds.includes(
                        feature.properties.orgUnit_id
                    )
                ) {
                    highlightedLayers.push(layer.getBounds())
                    const popupContent = `
                        <div class=${style.customPopup}>
                            <h3>${feature.properties.orgUnit_name}</h3>
                            <p>Commune ${feature.properties.municipality}</p>
                            <span>Nombre de cas:<b> ${feature.properties.value} </b></span>
                        </div>
                    `
                    layer.bindPopup(popupContent)
                    layer.addTo(map)
                    layer.openPopup()

                    setInitialLayerStates((prev) => [
                        ...prev,
                        {
                            id: feature.properties.orgUnit_id,
                            style: geoJSONStyle(feature),
                            pathClass: layer._path ? layer._path.className : '', 
                        },
                    ])
                }
            })

            if (highlightedLayers.length > 0) {
                const groupBounds = L.latLngBounds(highlightedLayers)
                map.fitBounds(groupBounds)
            } else {
                resetZoom()
            }
        }
    }

    useEffect(() => {
        zoomToHighlightedUnits()
    }, [highlightedOrgUnitIds, geoData])

    const getColor = (value) => {
        if (maxValue === minValue) {
            return colors[0]
        }
        const step = (maxValue - minValue) / (colors.length - 1)
        const index = Math.min(
            Math.floor((value - minValue) / step),
            colors.length - 1
        )
        return colors[index]
    }

    const geoJSONStyle = (feature) => {
        const value = feature.properties.value
        const fillColor = getColor(value)
        return {
            color: 'gray',
            weight: 1,
            opacity: 0.8,
            fillColor: fillColor,
            fillOpacity: 1,
        }
    }

    const highlightFeature = (e) => {
        const layer = e.target
        layer.setStyle({
            weight: 3,
            color: 'yellow',
            fillOpacity: 0.8,
        })
    }

    const resetHighlight = (e) => {
        const layer = e.target
        layer.setStyle(geoJSONStyle(layer.feature))
    }

    const onEachFeature = (feature, layer) => {
        if (feature.properties && feature.properties.orgUnit_id) {
            const popupContent = `
            <div class=${style.customPopup}>
                <h3>${feature.properties.orgUnit_name}</h3>
                <p>Commune ${feature.properties.municipality}</p>
                <span>Nombre de cas:<b> ${feature.properties.value} </b></span>
            </div>
        `
            layer.bindPopup(popupContent)
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature,
            })
        }
        if (
            highlightedOrgUnitIds &&
            highlightedOrgUnitIds.includes(feature.properties.orgUnit_id)
        ) {
            layer.on('add', () => {
                if (layer._path) {
                    layer._path.classList.add(style.blinkBorder)
                    layer._path.style.setProperty(
                        '--stroke-color',
                        highlightedStrokeColor
                    )
                    layer._path.style.setProperty(
                        '--stroke-width',
                        highlightedStrokeWidth
                    )
                }
            })
        }
    }

    // Memoized GeoJSON component to avoid unnecessary re-renders
    const MemoizedGeoJSON = React.memo(({ data, style, onEachFeature }) => (
        <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />
    ))

    return (
        <MapContainer
            center={center}
            zoom={initialZoom}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data && (
                <>
                    <MemoizedGeoJSON
                        data={geoData}
                        style={geoJSONStyle}
                        onEachFeature={onEachFeature}
                    />
                    <MapEvents />
                    <MapLegend
                        colors={colors}
                        minValue={minValue}
                        maxValue={maxValue}
                    />
                </>
            )}
        </MapContainer>
    )
}

export default Map
