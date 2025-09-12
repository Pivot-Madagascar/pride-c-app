import i18n from '../locales'

const createPopupContent = (feature, style) => {
    const { level, orgUnitName, value, periodName } = feature.properties
    let content
    switch (Number(level)) {
        case 3:
            content = `
                <div class="${style.customPopup}">
                    <h3>${i18n.t('District of')} ${orgUnitName}</h3>
                    ${ value === undefined || Number.isNaN(value) ?
                        `<span><i>${i18n.t('Information not available')}</i></span>` :
                        `<span>${i18n.t('Number of cases:')}<b> ${value} </b></span>
                        <div><b>${periodName}</b></div>`
                    }
                </div>
            `
            break
        case 4:
            content = `
                <div class="${style.customPopup}">
                    <h3>${i18n.t('Municipality of')} ${orgUnitName}</h3>
                    ${ value === undefined || Number.isNaN(value) ?
                        `<span><i>${i18n.t('Information not available')}</i></span>` :
                        `<span>${i18n.t('Number of cases:')}<b> ${value} </b></span>
                        <div><b>${periodName}</b></div>`
                    }
                </div>
            `
            break
            case 5:
                content = `
                    <div class="${style.customPopup}">
                        <h3>${orgUnitName}</h3>
                        ${ value === undefined || Number.isNaN(value) ?
                            `<span><i>${i18n.t('Information not available')}</i></span>` :
                            `<span>${i18n.t('Number of cases:')}<b> ${value} </b></span>
                            <div><b>${periodName}</b></div>`
                        }
                    </div>
                `
                break
        case 6:
            content = `
                <div class="${style.customPopup}">
                    <h3>${i18n.t('Fokontany of')} ${orgUnitName}</h3>
                    ${ value === undefined || Number.isNaN(value) ?
                        `<span><i>${i18n.t('Information not available')}</i></span>` :
                        `<span>${i18n.t('Number of cases:')}<b> ${value} </b></span>
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
