export const HEALTH = {
    malariaMean : { name: 'malariaMean', code: 'paluCas', id: 'Kw0TfBXTgm3', },
    malariaLower : { name: 'malariaLower', code: 'paluCasLowCI', id: 'hzaDKPZfHGu' },
    malariaUpper : { name: 'malariaUpper', code: 'paluCasUppCI', id: 'bd8bE70F663' },
    iraMean : { name: 'iraMean', code: 'iraCas', id: 'E1nIauHxO7s' },
    iraLower : { name: 'iraLower', code: 'iraCasLowCI', id: 'biJA3hd4Pvo' },
    iraUpper : { name: 'iraUpper', code: 'iraCasUppCI', id: 'gJKDcRBnr4C' },
    diarrheaMean : { name: 'diarrheaMean', code: 'diarCas', id: 'XOA9f2CBbCH' },
    diarrheaLower : { name: 'diarrheaLower', code: 'diarCasLowCI', id: 'WPSXAdzihy8' },
    diarrheaUpper: { name: 'diarrheaUpper', code: 'diarCasUppCI', id: 'wKxaLx0ojJn' }
}

export const CLIMATE = {
    precipitation : { name: 'precipitation', displayName: 'Précipitation totale', code: 'ppt', id: 'ISr9cPiMngs', unit: 'mm', },
    temperature : { name: 'temperature', displayName: 'Temperature moyenne', code: 'tempMoyenne', id: 'aeG4ZbMuF14', unit: '°C'  }, 
    vegetationIndex : { name: 'vegetationIndex', displayName: 'Indicateur de végétation', code: 'evi', id: 'BOoCHrUvuLA', unit: null },
    waterSurfaceIndex : { name: 'waterSurfaceIndex', displayName: `Indicateur de l'eau de surface`, code: 'mndwi', id: 'DAwh6UCktZl', unit: null }, 
    vegetativeWaterIndex: { name: 'vegetativeWaterIndex', displayName: `Indicateur de l'eau vegetative`, code: 'gao', id: 'v71HS6hm7ud', unit: null }, 
    bushfireArea : { name: 'bushfireArea', displayName: 'Proportion de superficie avec un feu de brousse' , code: 'propFeu', id: 'HSunoz64mFZ', unit: '% en feu' },
    no2AtmLevel : { name: 'no2AtmLevel', displayName: '', code: 'NO2', id: 'Uz1dXz5uXQQ', unit: null }, 
    aodAtmLevel : { name: 'aodAtmLevel', displayName: 'Niveau moyen de la profondeur optique des aérosols', code: 'AOD', id: 'KDpv9QZs3cE', unit: 'nm' },
    floodedRiceFields : { name: 'floodedRiceFields', displayName: `Proportion moyenne de rizières inondé`, code: 'inondationRiz', id: 'hLxKUrydJDX', unit: '%' },
    atmHumidity : { name: 'atmHumidity', displayName: `Humidité atmosphérique`, code: 'humidite', id: 'YBV3XPvnp24', unit: 'g/kg (eau/air)' }, 
    windSpeed : { name: 'windSpeed', displayName: `Vitesse moyenne du vent`, code: 'vent', id: 'Me42WzmMhu7', unit: 'm/s' } 
}