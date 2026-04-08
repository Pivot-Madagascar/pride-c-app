import PhotoCamera from '@mui/icons-material/PhotoCameraOutlined'
import IconButton from '@mui/material/IconButton'
import L from 'leaflet'
import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './index.css'
import { useGeoData } from '@/hooks'
import { useMinMaxValues } from '@/hooks'
import { createPopupContent } from '@/utils/mapHelper'
import { setupMapScreenshoter } from '@/utils/mapScreenShoter'
import MemoizedGeoJSONLayer from '@/components/Map/GeoJSONLayer'
import MapEventsHandler from '@/components/Map/MapEventsHandler'
import MapLegend from '@/components/Map/MapLegend'
import style from './Map.module.scss'
const center = [-21.0100, 47.6111]
const initialZoom = 9
const highlightedStrokeColor = 'blue'
const highlightedStrokeWidth = '4px'
const MapComponent = ({
    data,
    colors,
    periodId,
    adminLvl,
    highlightedOrgUnitIds = [],
    onClick,
    features,
}) => {
    const [map, setMap] = useState(null)
    const [initialLayerStates, setInitialLayerStates] = useState([])
    const geoData = useGeoData(data, periodId, features, adminLvl)
    const [minValue, maxValue] = useMinMaxValues(geoData)

    useEffect(() => {
        if (map) {
            setupMapScreenshoter(
                map,
                () => console.log('Screening started...'),
                () => console.log('Screening done...'),
                (error) => console.error('Screening error:', error)
            )
        }
    }, [map])

    const resetZoom = () => {
        if (map) {
            map.eachLayer((layer) => layer.closePopup())
            initialLayerStates.forEach(({ id, style, pathClass }) => {
                const layer = L.geoJSON(
                    geoData.features.find((f) => f.properties.orgUnitId === id)
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
    const getColor = (value) => {
        // Check if the value is undefined
        if (!value) {
            if (value === 0) {
                return 'white'
            }
            return 'var(--color-primary-text)'
        } else {
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
    }
    const createGeoJSONLayer = (feature) => {
        const layer = L.geoJSON(feature)
        const popupContent = createPopupContent(feature, style)
        layer.bindPopup(popupContent)
        return layer
    }
    const zoomToFeature = (e) => {
        if (map) {
            const target = e.target
            onClick(target.feature.properties)
            if (target.getBounds) {
                map.fitBounds(target.getBounds())
            } else if (target.getLatLng) {
                map.setView(target.getLatLng(), map.getZoom())
            } else {
                console.warn(
                    'Neither getBounds nor getLatLng available on this element.',
                    target
                )
            }
        }
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
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature,
        })
        if (highlightedOrgUnitIds.includes(feature.properties.orgUnitId)) {
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
    const zoomToHighlightedUnits = () => {
        if (map && geoData) {
            const highlightedLayers = []
            geoData.features.forEach((feature) => {
                if (
                    highlightedOrgUnitIds.includes(
                        feature.properties.orgUnitId
                    )
                ) {
                    const layer = createGeoJSONLayer(feature)
                    highlightedLayers.push(layer.getBounds())
                    layer.addTo(map)
                    layer.openPopup()
                    setInitialLayerStates((prev) => [
                        ...prev,
                        {
                            id: feature.properties.orgUnitId,
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

    const removePointFeatures = (features) => {
        return features.filter((feature) => feature.geometry.type !== 'Point')
    }

    const filteredGeoData = {
        ...geoData,
        features: removePointFeatures(geoData.features),
    }

    return (
        <MapContainer
            center={center}
            zoom={initialZoom}
            style={{ height: '100%', width: '100%', borderRadius: '8px', overflow: 'hidden' }}
            id="map-container"
        >
            { !data.length && 
                <div className={style.overlay}>
                    <span>Information non disponible</span>
                </div>
            }
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            { data.length > 0 && (
                <>
                    <MemoizedGeoJSONLayer
                        data={filteredGeoData} // Use filtered geoData
                        style={geoJSONStyle}
                        onEachFeature={onEachFeature}
                    />
                    <MapEventsHandler setMap={setMap} />
                    {features.length > 1 && (
                        <MapLegend
                            colors={colors}
                            minValue={minValue}
                            maxValue={maxValue}
                        />
                    )}
                </>
            )}
        </MapContainer>
    )
}
export default MapComponent
