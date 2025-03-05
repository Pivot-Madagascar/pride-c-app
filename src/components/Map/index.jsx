import React, { useEffect, useState, useMemo } from 'react'
import {
    MapContainer,
    TileLayer,
    GeoJSON,
    useMapEvents,
    useMap,
} from 'react-leaflet'
import { addOrgUnitNameToFeatures, groupByPeriod } from '../../utils/formatting'
import 'leaflet/dist/leaflet.css'
import Loader from '../Loader'
import style from './Map.module.scss'
import MapLegend from './MapLegend'
import useOrgUnits from '../../hooks/useOrgUnits'
import L from 'leaflet'
import { Center, CircularLoader } from '@dhis2/ui'

const center = [-21.0347, 47.6111]
const initialZoom = 9
const highlightedStrokeColor = 'blue'
const highlightedStrokeWidth = '4px'

const markerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
})

const Map = ({
    data,
    colors,
    periodId,
    adminLvl,
    highlightedOrgUnitIds = [],
    onClick,
    orgUnitLevel,
    parentOrgUnit,
}) => {
    const [map, setMap] = useState(null)
    const [geoJson, setGeoJson] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const { features, loading } = useOrgUnits({
        parent: parentOrgUnit,
        level: orgUnitLevel,
    })

    useEffect(() => {
        if (loading) {
            setIsLoading(true)
        } else {
            setGeoJson(features)
            setIsLoading(false)
        }
    }, [features, loading])

    const geoData = useMemo(() => {
        if (data && geoJson) {
            const features = addOrgUnitNameToFeatures(
                geoJson,
                groupByPeriod(data)[periodId],
                adminLvl
            )
            return {
                type: 'FeatureCollection',
                features: features,
            }
        }
        return null
    }, [data, periodId, geoJson, adminLvl])

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
            if (typeof target.getBounds === 'function') {
                map.fitBounds(target.getBounds())
            } else if (typeof target.getLatLng === 'function') {
                map.setView(target.getLatLng(), map.getZoom())
            } else {
                console.warn(
                    'Neither getBounds nor getLatLng available on this element.',
                    target
                )
            }
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
                }
            })

            if (highlightedLayers.length > 0) {
                const groupBounds = L.latLngBounds(highlightedLayers)
                map.fitBounds(groupBounds)
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
        const map = useMap()
        if (feature.geometry.type === 'Point') {
            const marker = L.marker(feature.geometry.coordinates.reverse(), {
                icon: markerIcon,
            })
            marker.bindPopup(`
                <div class=${style.customPopup}>
                    <h3>${feature.properties.orgUnit_name}</h3>
                    <p>Commune ${feature.properties.municipality}</p>
                    <span>Nombre de cas:<b> ${feature.properties.value} </b></span>
                </div>
            `)
            marker.addTo(map)
        } else {
            layer.bindPopup(`
                <div class=${style.customPopup}>
                    <h3>${feature.properties.orgUnit_name}</h3>
                    <p>Commune ${feature.properties.municipality}</p>
                    <span>Nombre de cas:<b> ${feature.properties.value} </b></span>
                </div>
            `)
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
        <div className={style.mapWrapper}>
            {isLoading ? (
                <Center>
                    <CircularLoader />
                </Center>
            ) : (
                <MapContainer
                    center={center}
                    zoom={initialZoom}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
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
                </MapContainer>
            )}
        </div>
    )
}

export default Map
