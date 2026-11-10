// Data expected on the test instance.
// Verified through the API (GET /api/organisationUnits/VtP4BdCeXIo) on DHIS2 2.40.3.
export const parentOrgUnit = {
    id: 'VtP4BdCeXIo',
    displayName: 'Ifanadiana',
    level: 3,
}

// Codes of the "alert" indicators/data elements shown on the dashboard cards,
// per disease card and per indicator (keys match the dashboard indicator names).
// Verified through the API (GET /api/indicators and /api/dataElements
// filtered by code) on DHIS2 2.40.3. IDs are resolved at runtime from codes.
export const dashboardAlertCodes = {
    malaria: {
        incidence: 'pridec_alert_ADJMalaria',
        csbCases: 'pridec_alert_CSBMalaria',
        comCases: 'pridec_alert_COMMalaria',
        csbVigilance: 'pridec_alert_CSBMalariaVigilance',
    },
    diarrhea: {
        incidence: 'pridec_alert_ADJDiarrhea',
        csbCases: 'pridec_alert_CSBDiarrhea',
        comCases: 'pridec_alert_COMDiarrhea',
        csbVigilance: 'pridec_alert_CSBDiarrheaVigilance',
    },
    ira: {
        incidence: 'pridec_alert_ADJRespinf',
        csbCases: 'pridec_alert_CSBRespinf',
        comCases: 'pridec_alert_COMRespinf',
        csbVigilance: 'pridec_alert_CSBRespinfVigilance',
    },
}
