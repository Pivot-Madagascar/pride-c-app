import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useSelector } from 'react-redux'
import { addOrgUnitNameToFeatures } from '../../utils/formating'
import 'leaflet/dist/leaflet.css'
import geojsonData from '../../assets/geoData/fokontany-geojson.json'
import MapLegend from './MapLegend'

const MapComponent = ({ data }) => {
    const [geoData, setGeoData] = useState(null)
    const [maxValue, setMaxValue] = useState(0)
    const [minValue, setMinValue] = useState(0)

    const getColor = (value) => {
        const colors = [
            '#FFCCCC', 
            '#FF9999',
            '#FF6666',
            '#FF3333',
            '#FF0000'  
        ];
        
        if (maxValue === minValue) {
            return colors[0];
        }

        const step = (maxValue - minValue) / (colors.length - 1);
        const index = Math.min(
            Math.floor((value - minValue) / step),
            colors.length - 1
        );

        return colors[index];
    }

    const onEachFeature = (feature, layer) => {
        if (feature.properties && feature.properties.orgUnit_id) {
            layer.bindPopup(`${feature.properties.orgUnit_name}: ${feature.properties.value}`);
        }
    }

    const geoJSONStyle = (feature) => {
        const value = feature.properties.value;
        const fillColor = getColor(value);
        return {
            color: 'gray',
            weight: 3,
            opacity: 0.8,
            fillColor: fillColor,
            fillOpacity: 1,
        }
    }

    useEffect(() => {
        if (data) {
            const features = addOrgUnitNameToFeatures(geojsonData.features, data);
            const updatedGeoJson = {type: 'FeatureCollection', features: features}

            const values = updatedGeoJson.features.map(feature => feature.properties.value);
            setMaxValue(Math.max(...values));
            setMinValue(Math.min(...values));

            setGeoData(updatedGeoJson);
        }
    }, [data]);

    return (
        <MapContainer
            center={[-21.0347, 47.6111]}
            zoom={9.5}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data && (
                <>
                    <GeoJSON
                    // key={Math.random()}
                    data={geoData}
                    style={geoJSONStyle}
                    onEachFeature={onEachFeature}
                />
                    <MapLegend colors={['#FFCCCC', '#FF9999', '#FF6666', '#FF3333', '#FF0000']} minValue={minValue} maxValue={maxValue} />
                </>
            )}
        </MapContainer>
    )
}

export default MapComponent
