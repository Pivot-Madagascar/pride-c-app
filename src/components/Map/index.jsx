import L from 'leaflet'
import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useGeoData } from '../../hooks/useGeoData'
import { useMinMaxValues } from '../../hooks/useMinMaxValue'
import { createPopupContent } from '../../utils/mapHelper'
import GeoJSONLayer from './GeoJSONLayer'
import style from './Map.module.scss'
import MapEventsHandler from './MapEventsHandler'
import MapLegend from './MapLegend'

const center = [-21.0347, 47.6111]
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

    const resetZoom = () => {
        if (map) {
            map.eachLayer((layer) => layer.closePopup())
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
        if (highlightedOrgUnitIds.includes(feature.properties.orgUnit_id)) {
            layer.on('add', () => {
                if (layer._path) {
                    layer._path.classList.add(style.blinkBorder)
                    layer._path.style.setProperty('--stroke-color', highlightedStrokeColor)
                    layer._path.style.setProperty('--stroke-width', highlightedStrokeWidth)
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
                        feature.properties.orgUnit_id
                    )
                ) {
                    const layer = createGeoJSONLayer(feature)
                    highlightedLayers.push(layer.getBounds())
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
                    <GeoJSONLayer
                        data={geoData}
                        style={geoJSONStyle}
                        onEachFeature={onEachFeature}
                    />
                    <MapEventsHandler setMap={setMap} />
                    { features.length > 1 && (
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
