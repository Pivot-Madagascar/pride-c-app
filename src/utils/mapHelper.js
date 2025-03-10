const createPopupContent = (feature, style) => {
    return `
        <div class="${style.customPopup}">
            <h3>${feature.properties.orgUnit_name}</h3>
            <p>Commune ${feature.properties.municipality}</p>
            <span>Nombre de cas:<b> ${feature.properties.value} </b></span>
        </div>
    `
}

const generateGeoJSONStyle = (feature, getColor) => {
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

export { createPopupContent, generateGeoJSONStyle }
