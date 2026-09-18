export const CLIMATE = {
    precipitation: {
        name: 'precipitation',
        displayName: 'Précipitation totale',
        code: 'pridec_climate_precipitation',
        id: undefined,
        unit: 'mm',
        type: 'dataElement',
    },
    temperature: {
        name: 'temperature',
        displayName: 'Temperature moyenne',
        code: 'pridec_climate_temperatureMean',
        id: undefined,
        unit: '°C',
        type: 'dataElement',
    },
    vegetationIndex: {
        name: 'vegetationIndex',
        displayName: 'Indicateur de végétation',
        code: 'pridec_climate_evi',
        id: undefined,
        unit: null,
        type: 'dataElement',
    },
    waterSurfaceIndex: {
        name: 'waterSurfaceIndex',
        displayName: `Indicateur de l'eau de surface`,
        code: 'pridec_climate_mndwi',
        id: undefined,
        unit: null,
        type: 'dataElement',
    },
    vegetativeWaterIndex: {
        name: 'vegetativeWaterIndex',
        displayName: `Indicateur de l'eau vegetative`,
        code: 'pridec_climate_gao',
        id: undefined,
        unit: null,
        type: 'dataElement',
    },
    bushfireArea: {
        name: 'bushfireArea',
        displayName: 'Proportion de superficie avec un feu de brousse',
        code: 'pridec_climate_propFire',
        id: undefined,
        unit: '% en feu',
        type: 'dataElement',
    },
    no2AtmLevel: {
        name: 'no2AtmLevel',
        displayName: '',
        code: 'pridec_climate_NO2',
        id: undefined,
        unit: null,
        type: 'dataElement',
    },
    aodAtmLevel: {
        name: 'aodAtmLevel',
        displayName: 'Niveau moyen de la profondeur optique des aérosols',
        code: 'pridec_climate_AOD',
        id: undefined,
        unit: 'nm',
        type: 'dataElement',
    },
    floodedRiceFields: {
        name: 'floodedRiceFields',
        displayName: `Proportion moyenne de rizières inondé`,
        code: 'pridec_climate_floodedRice',
        id: undefined,
        unit: 'en %',
        type: 'dataElement',
    },
    atmHumidity: {
        name: 'atmHumidity',
        displayName: `Humidité atmosphérique`,
        code: 'pridec_climate_relHumidity',
        id: undefined,
        unit: 'g/kg (eau/air)',
        type: 'dataElement',
    },
    windSpeed: {
        name: 'windSpeed',
        displayName: `Vitesse moyenne du vent`,
        code: 'pridec_climate_windspeed',
        id: undefined,
        unit: 'm/s',
        type: 'dataElement',
    },
}

export const MALARIA = {
    historic: {
        adjusted: {
            name: 'PRIDEC : HISTORIC Adjusted Case Rate  - Malaria',
            code: 'pridec_historic_ADJMalaria',
            id: 'M6xYIdmQ1sD',
            type: 'dataElement',
        },
        csbCases: {
            name: 'PRIDEC : HISTORIC CSB Reported Cases  - Malaria',
            code: 'pridec_historic_CSBMalaria',
            id: 'fxlyV7TBKHn',
            type: 'dataElement',
        },
        comCases: {
            name: 'PRIDEC : HISTORIC COM Reported Cases  - Malaria',
            code: 'pridec_historic_COMMalaria',
            id: 'dA9FwHe5k4U',
            type: 'dataElement',
        },
    },
    forecast: {
        adjusted: {
            avg: {
                name: 'PRIDEC : FORECAST Adjusted Case Rate  - Malaria (Avg)',
                code: 'pridec_forecast_ADJMalariaAvg',
                id: 'Kw0TfBXTgm3',
                type: 'dataElement',
            },
            lowci: {
                name: 'PRIDEC : FORECAST Adjusted Case Rate  - Malaria (LowCI)',
                code: 'pridec_forecast_ADJMalariaLowCI',
                id: 'hzaDKPZfHGu',
                type: 'dataElement',
            },
            uppci: {
                name: 'PRIDEC : FORECAST Adjusted Case Rate  - Malaria (UppCI)',
                code: 'pridec_forecast_ADJMalariaUppCI',
                id: 'bd8bE70F663',
                type: 'dataElement',
            },
        },
        csbCases: {
            avg: {
                name: 'PRIDEC : FORECAST CSB Reported Cases  - Malaria (Avg)',
                code: 'pridec_forecast_CSBMalariaAvg',
                id: 'Kho6sN2pCZP',
                type: 'dataElement',
            },
            lowci: {
                name: 'PRIDEC : FORECAST CSB Reported Cases  - Malaria (LowCI)',
                code: 'pridec_forecast_CSBMalariaLowCI',
                id: 'VKcwXIyQpUS',
                type: 'dataElement',
            },
            uppci: {
                name: 'PRIDEC : FORECAST CSB Reported Cases  - Malaria (UppCI)',
                code: 'pridec_forecast_CSBMalariaUppCI',
                id: 'TmaZE8pXsRD',
                type: 'dataElement',
            },
        },
        comCases: {
            avg: {
                name: 'PRIDEC : FORECAST COM Reported Cases  - Malaria (Avg)',
                code: 'pridec_forecast_COMMalariaAvg',
                id: 'TiSmgOUw7rR',
                type: 'dataElement',
            },
            lowci: {
                name: 'PRIDEC : FORECAST COM Reported Cases  - Malaria (LowCI)',
                code: 'pridec_forecast_COMMalariaLowCI',
                id: 'zGftXla8B5i',
                type: 'dataElement',
            },
            uppci: {
                name: 'PRIDEC : FORECAST COM Reported Cases  - Malaria (UppCI)',
                code: 'pridec_forecast_COMMalariaUppCI',
                id: 'u3R5ToM9AdE',
                type: 'dataElement',
            },
        },
    },
    alert: {
        csb: {
            name: 'PRIDEC : ALERT Forecast CSB Reported Cases this quarter - Malaria',
            code: 'pridec_alert_CSBMalaria',
            id: 'QtpZEJoIvys',
            type: 'indicator',
        },
        comCases: {
            name: 'PRIDEC : ALERT Forecast Community Case Rate this quarter - Malaria',
            code: 'pridec_alert_COMMalaria',
            id: 'sh6kLJ3FH0t',
            type: 'indicator',
        },
        incidence: {
            name: 'PRIDEC : ALERT Forecast Adjusted Case Rate this quarter - Malaria',
            code: 'pridec_alert_ADJMalaria',
            id: 'BaKGwE4Iigs',
            type: 'indicator',
        },
        csbVigilance: {
            name: 'PRIDEC : ALERT Number of CSB in Vigilance - Malaria',
            code: 'pridec_alert_CSBMalariaVigilance',
            id: 'edypuriPm01',
            type: 'dataElement',
        },
    },
    compare: {
        csb: {
            name: 'PRIDEC : ALERT Compare Forecast CSB Reported Cases  to Prior Year - Malaria',
            code: 'pridec_alert_CompareCSBMalaria',
            id: 'E3b4urWlN5g',
            type: 'indicator',
        },
        comCases: {
            name: 'PRIDEC : ALERT Compare Forecast Community Case Rate to Prior Year - Malaria',
            code: 'pridec_alert_CompareCOMMalaria',
            id: 'I5Xgp0lsaNA',
            type: 'indicator',
        },
        incidence: {
            name: 'PRIDEC : ALERT Compare Forecast Adjusted Case Rate to Prior Year - Malaria',
            code: 'pridec_alert_CompareADJMalaria',
            id: 'Tc60p45AilG',
            type: 'indicator',
        },
        trend: {
            name: 'PRIDEC : ALERT Trend in CSB Reported Cases over next month - Malaria',
            code: 'pridec_alert_CSBTrendMalaria',
            id: 'Eq5ZwlMlJEC',
            type: 'indicator',
        },
    },
}

export const IRA = {
    historic: {
        adjusted: {
            name: 'PRIDEC : HISTORIC Adjusted Case Rate  - Resp Inf',
            code: 'pridec_historic_ADJRespinf',
            id: undefined,
            type: 'dataElement',
        },
        csbCases: {
            name: 'PRIDEC : HISTORIC CSB Reported Cases  - Resp Inf',
            code: 'pridec_historic_CSBRespinf',
            id: undefined,
            type: 'dataElement',
        },
        comCases: {
            name: 'PRIDEC : HISTORIC COM Reported Cases  - Resp Inf',
            code: 'pridec_historic_COMRespinf',
            id: undefined,
            type: 'dataElement',
        },
    },
    forecast: {
        adjusted: {
            avg: {
                name: 'PRIDEC : FORECAST Adjusted Case Rate  - Resp Inf (Avg)',
                code: 'pridec_forecast_ADJRespinfAvg',
                id: undefined,
                type: 'dataElement',
            },
            lowci: {
                name: 'PRIDEC : FORECAST Adjusted Case Rate  - Resp Inf (LowCI)',
                code: 'pridec_forecast_ADJRespinfLowCI',
                id: undefined,
                type: 'dataElement',
            },
            uppci: {
                name: 'PRIDEC : FORECAST Adjusted Case Rate  - Resp Inf (UppCI)',
                code: 'pridec_forecast_ADJRespinfUppCI',
                id: undefined,
                type: 'dataElement',
            },
        },
        csbCases: {
            avg: {
                name: 'PRIDEC : FORECAST CSB Reported Cases  - Resp Inf (Avg)',
                code: 'pridec_forecast_CSBRespinfAvg',
                id: undefined,
                type: 'dataElement',
            },
            lowci: {
                name: 'PRIDEC : FORECAST CSB Reported Cases  - Resp Inf (LowCI)',
                code: 'pridec_forecast_CSBRespinfLowCI',
                id: undefined,
                type: 'dataElement',
            },
            uppci: {
                name: 'PRIDEC : FORECAST CSB Reported Cases  - Resp Inf (UppCI)',
                code: 'pridec_forecast_CSBRespinfUppCI',
                id: undefined,
                type: 'dataElement',
            },
        },
        comCases: {
            avg: {
                name: 'PRIDEC : FORECAST COM Reported Cases  - Resp Inf (Avg)',
                code: 'pridec_forecast_COMRespinfAvg',
                id: undefined,
                type: 'dataElement',
            },
            lowci: {
                name: 'PRIDEC : FORECAST COM Reported Cases  - Resp Inf (LowCI)',
                code: 'pridec_forecast_COMRespinfLowCI',
                id: undefined,
                type: 'dataElement',
            },
            uppci: {
                name: 'PRIDEC : FORECAST COM Reported Cases  - Resp Inf (UppCI)',
                code: 'pridec_forecast_COMRespinfUppCI',
                id: undefined,
                type: 'dataElement',
            },
        },
    },
    alert: {
        csb: {
            name: 'PRIDEC : ALERT Forecast CSB Reported Cases this quarter- Resp Inf',
            code: 'pridec_alert_CSBRespinf',
            id: undefined,
            type: 'indicator',
        },
        comCases: {
            name: 'PRIDEC : ALERT Forecast Community Case Rate this quarter - Resp Inf',
            code: 'pridec_alert_COMRespinf',
            id: undefined,
            type: 'indicator',
        },
        incidence: {
            name: 'PRIDEC : ALERT Forecast Adjusted Case Rate this quarter - Resp Inf',
            code: 'pridec_alert_ADJRespinf',
            id: undefined,
            type: 'indicator',
        },
        csbVigilance: {
            name: 'PRIDEC : ALERT Number of CSB in Vigilance - Resp Inf',
            code: 'pridec_alert_CSBRespinfVigilance',
            id: undefined,
            type: 'dataElement',
        },
    },
    compare: {
        csb: {
            name: 'PRIDEC : ALERT Compare CSB Reported Cases Compared to Prior Year - Resp Inf',
            code: 'pridec_alert_CompareCSBRespinf',
            id: undefined,
            type: 'indicator',
        },
        comCases: {
            name: 'PRIDEC : ALERT Compare Forecast Community Case Rate to Prior Year - Resp Inf"',
            code: 'pridec_alert_CompareCOMRespinf',
            id: undefined,
            type: 'indicator',
        },
        incidence: {
            name: 'PRIDEC : ALERT Compare Forecast Adjusted Case Rate to Prior Year - Resp Inf',
            code: 'pridec_alert_CompareADJRespinf',
            id: undefined,
            type: 'indicator',
        },
        trend: {
            name: 'PRIDEC : ALERT Trend in CSB Reported Cases over next month - Resp Inf',
            code: 'pridec_alert_CSBTrendRespinf',
            id: undefined,
            type: 'indicator',
        },
    },
}

export const DIARRHEA = {
    historic: {
        adjusted: {
            name: 'PRIDEC : HISTORIC Adjusted Case Rate  - Diarrhea',
            code: 'pridec_historic_ADJDiarrhea',
            id: undefined,
            type: 'dataElement',
        },
        csbCases: {
            name: 'PRIDEC : HISTORIC CSB Reported Cases  - Diarrhea',
            code: 'pridec_historic_CSBDiarrhea',
            id: undefined,
            type: 'dataElement',
        },
        comCases: {
            name: 'PRIDEC : HISTORIC COM Reported Cases  - Diarrhea',
            code: 'pridec_historic_COMDiarrhea',
            id: undefined,
            type: 'dataElement',
        },
    },
    forecast: {
        adjusted: {
            avg: {
                name: 'PRIDEC : FORECAST Adjusted Case Rate  - Diarrhea (Avg)',
                code: 'pridec_forecast_ADJDiarrheaAvg',
                id: undefined,
                type: 'dataElement',
            },
            lowci: {
                name: 'PRIDEC : FORECAST Adjusted Case Rate  - Diarrhea (LowCI)',
                code: 'pridec_forecast_ADJDiarrheaLowCI',
                id: undefined,
                type: 'dataElement',
            },
            uppci: {
                name: 'PRIDEC : FORECAST Adjusted Case Rate  - Diarrhea (UppCI)',
                code: 'pridec_forecast_ADJDiarrheaUppCI',
                id: undefined,
                type: 'dataElement',
            },
        },
        csbCases: {
            avg: {
                name: 'PRIDEC : FORECAST CSB Reported Cases  - Diarrhea (Avg)',
                code: 'pridec_forecast_CSBDiarrheaAvg',
                id: undefined,
                type: 'dataElement',
            },
            lowci: {
                name: 'PRIDEC : FORECAST CSB Reported Cases  - Diarrhea (LowCI)',
                code: 'pridec_forecast_CSBDiarrheaLowCI',
                id: undefined,
                type: 'dataElement',
            },
            uppci: {
                name: 'PRIDEC : FORECAST CSB Reported Cases  - Diarrhea (UppCI)',
                code: 'pridec_forecast_CSBDiarrheaUppCI',
                id: undefined,
                type: 'dataElement',
            },
        },
        comCases: {
            avg: {
                name: 'PRIDEC : FORECAST COM Reported Cases  - Diarrhea (Avg)',
                code: 'pridec_forecast_COMDiarrheaAvg',
                id: undefined,
                type: 'dataElement',
            },
            lowci: {
                name: 'PRIDEC : FORECAST COM Reported Cases  - Diarrhea (LowCI)',
                code: 'pridec_forecast_COMDiarrheaLowCI',
                id: undefined,
                type: 'dataElement',
            },
            uppci: {
                name: 'PRIDEC : FORECAST COM Reported Cases  - Diarrhea (UppCI)',
                code: 'pridec_forecast_COMDiarrheaUppCI',
                id: undefined,
                type: 'dataElement',
            },
        },
    },
    alert: {
        csb: {
            name: 'PRIDEC : ALERT Forecast CSB Reported Cases this quarter - Diarrhea',
            code: 'pridec_alert_CSBDiarrhea',
            id: undefined,
            type: 'indicator',
        },
        comCases: {
            name: 'PRIDEC : ALERT Forecast Community Case Rate this quarter - Diarrhea',
            code: 'pridec_alert_COMDiarrhea',
            id: undefined,
            type: 'indicator',
        },
        incidence: {
            name: 'PRIDEC : ALERT Forecast Adjusted Case Rate this quarter - Diarrhea',
            code: 'pridec_alert_ADJDiarrhea',
            id: undefined,
            type: 'indicator',
        },
        csbVigilance: {
            name: 'PRIDEC : ALERT Number of CSB in Vigilance - Diarrhea',
            code: 'pridec_alert_CSBDiarrheaVigilance',
            id: undefined,
            type: 'dataElement',
        },
    },
    compare: {
        csb: {
            name: 'PRIDEC : ALERT Compare Forecast CSB Reported Cases  to Prior Year - Diarrhea',
            code: 'pridec_alert_CompareCSBDiarrhea',
            id: undefined,
            type: 'indicator',
        },
        comCases: {
            name: 'PRIDEC : ALERT Compare Forecast Community Case Rate to Prior Year - Diarrhea',
            code: 'pridec_alert_CompareCOMDiarrhea',
            id: undefined,
            type: 'indicator',
        },
        incidence: {
            name: 'PRIDEC : ALERT Compare Forecast Adjusted Case Rate to Prior Year - Diarrhea',
            code: 'pridec_alert_CompareADJDiarrhea',
            id: undefined,
            type: 'indicator',
        },
        trend: {
            name: 'PRIDEC : ALERT Trend in CSB Reported Cases over next month - Diarrhea',
            code: 'pridec_alert_CSBTrendDiarrhea',
            id: undefined,
            type: 'indicator',
        },
    },
}
