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
    precipitation : { name: 'precipitation', code: 'ppt', id: 'ISr9cPiMngs' }, // en mm
    temperature : { name: 'temperature', code: 'tempMoyenne', id: 'aeG4ZbMuF14' }, // en °C
    vegetationIndex : { name: 'vegetationIndex', code: 'evi', id: 'BOoCHrUvuLA' }, // Pas d'unité EVI
    waterSurfaceIndex : { name: 'waterSurfaceIndex', code: 'mndwi', id: 'DAwh6UCktZl' }, // Pas d'unité mndwi
    vegetativeWaterIndex: { name: 'vegetativeWaterIndex', code: 'gao', id: 'v71HS6hm7ud' }, // Pas d'unité gao
    bushfireArea : { name: 'bushfireArea', code: 'propFeu', id: 'HSunoz64mFZ' }, // en % en feu
    no2AtmLevel : { name: 'no2AtmLevel', code: 'NO2', id: 'Uz1dXz5uXQQ' }, // Pas dispo
    aodAtmLevel : { name: 'aodAtmLevel', code: 'AOD', id: 'KDpv9QZs3cE' }, // en nm
    floodedRiceFields : { name: 'floodedRiceFields', code: 'inondationRiz', id: 'hLxKUrydJDX' }, // en %
    atmHumidity : { name: 'atmHumidity', code: 'humidite', id: 'YBV3XPvnp24' }, // g/kg (eau/air)
    windSpeed : { name: 'windSpeed', code: 'vent', id: 'Me42WzmMhu7' } // en m/s
}