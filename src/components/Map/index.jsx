import PhotoCamera from '@mui/icons-material/PhotoCameraOutlined'
import IconButton from '@mui/material/IconButton'
import L from 'leaflet'
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
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
const EMPTY_IDS = []

const MapComponent = ({
    data,
    colors,
    periodId,
    adminLvl,
    highlightedOrgUnitIds = EMPTY_IDS,
    onClick,
    features,
}) => {
    const [map, setMap] = useState(null)
    // Map instance also kept in a ref so that feature handlers stay stable
    const mapRef = useRef(null)
    // Popup layers added on top of the map for the highlighted org units.
    // Kept so they can be removed before new ones are added (avoids piling up
    // Leaflet layers each time the selection changes).
    const highlightLayersRef = useRef([])

    const geoData = useGeoData(data, periodId, features, adminLvl)
    const [minValue, maxValue] = useMinMaxValues(geoData)
    // No numeric value in the features: Math.min()/Math.max() on an empty
    // list return Infinity / -Infinity
    const hasNoValues = minValue === Infinity && maxValue === -Infinity

    // Primitive key: effects/callbacks only re-run when the selected ids
    // really change, not when the parent passes a new array instance.
    const highlightKey = highlightedOrgUnitIds.join('|')

    useEffect(() => {
        mapRef.current = map
        if (map) {
            setupMapScreenshoter(
                map,
                () => console.log('Screening started...'),
                () => console.log('Screening done...'),
                (error) => console.error('Screening error:', error)
            )
        }
    }, [map])

    const getColor = useCallback(
        (value) => {
            // Check if the value is undefined
            if (!value) {
                if (value === 0) {
                    return 'white'
                }
                return 'var(--color-primary-text)'
            }
            if (maxValue === minValue) {
                return colors[0]
            }

            const step = (maxValue - minValue) / (colors.length - 1)
            const index = Math.min(
                Math.floor((value - minValue) / step),
                colors.length - 1
            )

            return colors[index]
        },
        [colors, minValue, maxValue]
    )

    const geoJSONStyle = useCallback(
        (feature) => ({
            color: 'gray',
            weight: 1,
            opacity: 0.8,
            fillColor: getColor(feature.properties.value),
            fillOpacity: 1,
        }),
        [getColor]
    )

    const onEachFeature = useCallback(
        (feature, layer) => {
            const highlightedIds = highlightKey ? highlightKey.split('|') : []

            layer.on({
                mouseover: (e) => {
                    e.target.setStyle({
                        weight: 3,
                        color: 'yellow',
                        fillOpacity: 0.8,
                    })
                },
                mouseout: (e) => {
                    e.target.setStyle(geoJSONStyle(e.target.feature))
                },
                click: (e) => {
                    const currentMap = mapRef.current
                    if (!currentMap) {
                        return
                    }
                    const target = e.target
                    onClick(target.feature.properties)
                    if (target.getBounds) {
                        currentMap.fitBounds(target.getBounds())
                    } else if (target.getLatLng) {
                        currentMap.setView(target.getLatLng(), currentMap.getZoom())
                    } else {
                        console.warn(
                            'Neither getBounds nor getLatLng available on this element.',
                            target
                        )
                    }
                },
            })
            if (highlightedIds.includes(feature.properties.orgUnitId)) {
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
        },
        [geoJSONStyle, onClick, highlightKey]
    )

    // Zoom on the highlighted org units (or reset the view when none).
    // Previous highlight layers are always removed first.
    useEffect(() => {
        if (!map || !geoData) {
            return
        }

        highlightLayersRef.current.forEach((layer) => layer.remove())
        highlightLayersRef.current = []

        const highlightedIds = highlightKey ? highlightKey.split('|') : []
        const bounds = []

        geoData.features.forEach((feature) => {
            if (highlightedIds.includes(feature.properties.orgUnitId)) {
                const layer = L.geoJSON(feature)
                layer.bindPopup(createPopupContent(feature, style))
                layer.addTo(map)
                layer.openPopup()
                highlightLayersRef.current.push(layer)
                bounds.push(layer.getBounds())
            }
        })

        if (bounds.length > 0) {
            map.fitBounds(L.latLngBounds(bounds))
        } else {
            map.closePopup()
            map.setView(center, initialZoom)
        }
    }, [map, geoData, highlightKey])

    // Remove highlight layers when the map is unmounted
    useEffect(
        () => () => {
            highlightLayersRef.current.forEach((layer) => layer.remove())
            highlightLayersRef.current = []
        },
        []
    )

    const filteredGeoData = useMemo(
        () =>
            geoData && {
                ...geoData,
                features: geoData.features.filter(
                    (feature) => feature.geometry.type !== 'Point'
                ),
            },
        [geoData]
    )

    return (
        <MapContainer
            center={center}
            zoom={initialZoom}
            style={{ height: '100%', width: '100%', borderRadius: '8px', overflow: 'hidden' }}
            id="map-container"
        >
            { (!data.length || hasNoValues) &&
                <div className={style.overlay}>
                    <span>Information non disponible</span>
                </div>
            }
            <TileLayer
                attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                maxZoom={16}
            />
            { data.length > 0 && (
                <>
                    <MemoizedGeoJSONLayer
                        data={filteredGeoData} // Use filtered geoData
                        style={geoJSONStyle}
                        onEachFeature={onEachFeature}
                    />
                    <MapEventsHandler setMap={setMap} />
                    {features.length > 1 && !hasNoValues && (
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

export default React.memo(MapComponent)
