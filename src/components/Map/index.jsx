import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet'
import { addOrgUnitNameToFeatures, groupByPeriod } from '../../utils/formatting'
import 'leaflet/dist/leaflet.css'
import geojsonData from '../../assets/geoData/fokontany-geojson.json'
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
}) => {
    const [geoData, setGeoData] = useState(null)
    const [maxValue, setMaxValue] = useState(0)
    const [minValue, setMinValue] = useState(0)
    const [map, setMap] = useState(null)

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
            map.fitBounds(e.target.getBounds())
        }
    }

    const zoomToHighlightedUnits = () => {
        if (map && geoData) {
            if (highlightedOrgUnitIds.length === 0) {
                map.setView(center, initialZoom)
                return
            }

            const highlightedLayers = []
            geoData.features.forEach((feature) => {
                if (
                    highlightedOrgUnitIds.includes(
                        feature.properties.orgUnit_id
                    )
                ) {
                    highlightedLayers.push(L.geoJSON(feature).getBounds())
                }
            })

            if (
                highlightedLayers.length > 0 &&
                adminDivisionType === 'municipality'
            ) {
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

    useEffect(() => {
        if (data) {
            const features = addOrgUnitNameToFeatures(
                geojsonData.features,
                groupByPeriod(data)[periodId]
            )
            const updatedGeoJson = {
                type: 'FeatureCollection',
                features: features,
            }

            const values = updatedGeoJson.features.map(
                (feature) => feature.properties.value
            )
            setMaxValue(Math.max(...values))
            setMinValue(Math.min(...values))

            setGeoData(updatedGeoJson)
        }
    }, [data, periodId])

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
                    <GeoJSON
                        key={Math.random()}
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
