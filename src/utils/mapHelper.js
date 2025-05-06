const createPopupContent = (feature, style) => {
    const { level, orgUnitName, value, periodName } = feature.properties
    let content
    switch (Number(level)) {
        case 3:
            content = `
                <div class="${style.customPopup}">
                    <h3>District de ${orgUnitName}</h3>
                    ${ value === undefined ? 
                        '<span><i>Information non disponible</i></span>' :
                        `<span>Nombre de cas:<b> ${value} </b></span>
                        <div><b>${periodName}</b></div>`
                    }
                </div>
            `
            break
        case 4:
            content = `
                <div class="${style.customPopup}">
                    <h3>Commune de ${orgUnitName}</h3>
                    ${ value === undefined ? 
                        '<span><i>Information non disponible</i></span>' :
                        `<span>Nombre de cas:<b> ${value} </b></span>
                        <div><b>${periodName}</b></div>`
                    }
                </div>
            `
            break
            case 5:
                content = `
                    <div class="${style.customPopup}">
                        <h3>${orgUnitName}</h3>
                        ${ value === undefined ? 
                            '<span><i>Information non disponible</i></span>' :
                            `<span>Nombre de cas:<b> ${value} </b></span>
                            <div><b>${periodName}</b></div>`
                        }
                    </div>
                `
                break
        case 6:
            content = `
                <div class="${style.customPopup}">
                    <h3>Fokontany de ${orgUnitName}</h3>
                    ${ value === undefined ? 
                        '<span><i>Information non disponible</i></span>' :
                        `<span>Nombre de cas:<b> ${value} </b></span>
                        <div><b>${periodName}</b></div>`
                    }
                </div>
            `
            break
    }
    return content
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
