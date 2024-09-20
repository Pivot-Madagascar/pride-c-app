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

export const MALARIA = {
    historic: { 
        adjusted: { name: 'PRIDEC : HISTORIC Adjusted Case Rate  - Malaria', code: 'pridec_historic_ADJMalaria', id: 'M6xYIdmQ1sD' },
        csbCases: { name: 'PRIDEC : HISTORIC CSB Reported Cases  - Malaria', code: 'pridec_historic_CSBMalaria', id: 'fxlyV7TBKHn' },
        comCases: { name: 'PRIDEC : HISTORIC COM Reported Cases  - Malaria', code: 'pridec_historic_COMMalaria', id: 'dA9FwHe5k4U' },
    },
    forecast: { 
        adjusted: { 
            avg: { name: 'PRIDEC : FORECAST Adjusted Case Rate  - Malaria (Avg)', code: 'pridec_forecast_ADJMalariaAvg', id: 'Kw0TfBXTgm3' },
            lowci: { name: 'PRIDEC : FORECAST Adjusted Case Rate  - Malaria (LowCI)', code: 'pridec_forecast_ADJMalariaLowCI', id: 'hzaDKPZfHGu' },
            uppci: { name: 'PRIDEC : FORECAST Adjusted Case Rate  - Malaria (UppCI)', code: 'pridec_forecast_ADJMalariaUppCI', id: 'bd8bE70F663' }
        },
        csbCases: {
            avg: { name: 'PRIDEC : FORECAST CSB Reported Cases  - Malaria (Avg)', code: 'pridec_forecast_CSBMalariaAvg', id: 'Kho6sN2pCZP' },
            lowci: { name: 'PRIDEC : FORECAST CSB Reported Cases  - Malaria (LowCI)', code: 'pridec_forecast_CSBMalariaLowCI', id: 'VKcwXIyQpUS' },
            uppci: { name: 'PRIDEC : FORECAST CSB Reported Cases  - Malaria (UppCI)', code: 'pridec_forecast_CSBMalariaUppCI', id: 'TmaZE8pXsRD' }
        },
        comCases: {
            avg: { name: 'PRIDEC : FORECAST COM Reported Cases  - Malaria (Avg)', code: 'pridec_forecast_COMMalariaAvg', id: 'TiSmgOUw7rR' },
            lowci: { name: 'PRIDEC : FORECAST COM Reported Cases  - Malaria (LowCI)', code: 'pridec_forecast_COMMalariaLowCI', id: 'zGftXla8B5i' },
            uppci: { name: 'PRIDEC : FORECAST COM Reported Cases  - Malaria (UppCI)', code: 'pridec_forecast_COMMalariaUppCI', id: 'u3R5ToM9AdE' },
        }
    }
}

export const IRA = {
    historic: {
        adjusted: { name: 'PRIDEC : HISTORIC Adjusted Case Rate  - Resp Inf', code: 'pridec_historic_ADJRespinf', id: 'MUO5We2bV4p' },
        csbCases: { name: 'PRIDEC : HISTORIC CSB Reported Cases  - Resp Inf', code: 'pridec_historic_CSBRespinf', id: 'PVomHTNt4FR' },
        comCases: { name: 'PRIDEC : HISTORIC COM Reported Cases  - Resp Inf', code: 'pridec_historic_COMRespinf', id: 'umPIQxtJlDN' },
    },
    forecast: {
        adjusted: {
            avg: { name: 'PRIDEC : FORECAST Adjusted Case Rate  - Resp Inf (Avg)', code: 'pridec_forecast_ADJRespinfAvg', id: 'E1nIauHxO7s' },
            lowci: { name: 'PRIDEC : FORECAST Adjusted Case Rate  - Resp Inf (LowCI)', code: 'pridec_forecast_ADJRespinfLowCI', id: 'biJA3hd4Pvo' },
            uppci: { name: 'PRIDEC : FORECAST Adjusted Case Rate  - Resp Inf (UppCI)', code: 'pridec_forecast_ADJRespinfUppCI', id: 'gJKDcRBnr4C' }
        },
        csbCases: {
            avg: { name: 'PRIDEC : FORECAST CSB Reported Cases  - Resp Inf (Avg)', code: 'pridec_forecast_CSBRespinfAvg', id: 'xSg8GomKjHJ' },
            lowci: { name: 'PRIDEC : FORECAST CSB Reported Cases  - Resp Inf (LowCI)', code: 'pridec_forecast_CSBRespinfLowCI', id: 'WRUI6TJi2Hh' },
            uppci: { name: 'PRIDEC : FORECAST CSB Reported Cases  - Resp Inf (UppCI)', code: 'pridec_forecast_CSBRespinfUppCI', id: 'KZpyC6OtXsV' }
        },
        comCases: {
            avg: { name: 'PRIDEC : FORECAST COM Reported Cases  - Resp Inf (Avg)', code: 'pridec_forecast_COMRespinfAvg', id: 'htP3RcoVslB' },
            lowci: { name: 'PRIDEC : FORECAST COM Reported Cases  - Resp Inf (LowCI)', code: 'pridec_forecast_COMRespinfLowCI', id: 'mTLroZ9un4R' },
            uppci: { name: 'PRIDEC : FORECAST COM Reported Cases  - Resp Inf (UppCI)', code: 'pridec_forecast_COMRespinfUppCI', id: 'jdM7E4HfxbP' }
        }
    }
}

export const DIARRHEA = {
    historic: {
        adjusted: { name: 'PRIDEC : HISTORIC Adjusted Case Rate  - Diarrhea', code: 'pridec_historic_ADJDiarrhea', id: 'XrhFQdlS5Zt' },
        csbCases: { name: 'PRIDEC : HISTORIC CSB Reported Cases  - Diarrhea', code: 'pridec_historic_CSBDiarrhea', id: 'nlqM0kFSov2' },
        comCases: { name: 'PRIDEC : HISTORIC COM Reported Cases  - Diarrhea', code: 'pridec_historic_COMDiarrhea', id: 'bUWkpN1Xmti' }
    },
    forecast: {
        adjusted: {
            avg: { name: 'PRIDEC : FORECAST Adjusted Case Rate  - Diarrhea (Avg)', code: 'pridec_forecast_ADJDiarrheaAvg', id: 'XOA9f2CBbCH' },
            lowci: { name: 'PRIDEC : FORECAST Adjusted Case Rate  - Diarrhea (LowCI)', code: 'pridec_forecast_ADJDiarrheaLowCI', id: 'WPSXAdzihy8' },
            uppci: { name: 'PRIDEC : FORECAST Adjusted Case Rate  - Diarrhea (UppCI)', code: 'pridec_forecast_ADJDiarrheaUppCI', id: 'wKxaLx0ojJn' }
        },
        csbCases: {
            avg: { name: 'PRIDEC : FORECAST CSB Reported Cases  - Diarrhea (Avg)', code: 'pridec_forecast_CSBDiarrheaAvg', id: 'IqGEQ8eMi9H' },
            lowci: { name: 'PRIDEC : FORECAST CSB Reported Cases  - Diarrhea (LowCI)', code: 'pridec_forecast_CSBDiarrheaLowCI', id: 'IzLrfhAbXuP' },
            uppci: { name: 'PRIDEC : FORECAST CSB Reported Cases  - Diarrhea (UppCI)', code: 'pridec_forecast_CSBDiarrheaUppCI', id: 'zxI2gO6DlR4' }
        },
        comCases: {
            avg: { name: 'PRIDEC : FORECAST COM Reported Cases  - Diarrhea (Avg)', code: 'pridec_forecast_COMDiarrheaAvg', id: 'cSgVnWHxGCi' },
            lowci: { name: 'PRIDEC : FORECAST COM Reported Cases  - Diarrhea (LowCI)', code: 'pridec_forecast_COMDiarrheaLowCI', id: 'm1Ze8Es9dhl' },
            uppci: { name: 'PRIDEC : FORECAST COM Reported Cases  - Diarrhea (UppCI)', code: 'pridec_forecast_COMDiarrheaUppCI', id: 'jFSgTpOe4zX' }
        }
    }
}