export const getApiBaseUrl = () => {
    const baseUrl = Cypress.env('dhis2BaseUrl')
    if (!baseUrl) {
        throw new Error(
            'dhis2BaseUrl manquant : voir cypress.env.json ou les variables CYPRESS_*'
        )
    }
    return baseUrl
}

export const uniqueName = (prefix) =>
    `${prefix} ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

// No reset helpers: the app only reads data from DHIS2, the tests write nothing.
