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

// The app keeps its Redux state in the browser Cache Storage ("redux-cache").
// Clear it (and IndexedDB) for the app origin through the Chrome DevTools
// Protocol, so the next visit fetches everything from DHIS2.
// localStorage is kept: it holds DHIS2_BASE_URL. Chromium browsers only.
export const clearAppCache = () =>
    cy.wrap(
        Cypress.automation('remote:debugger:protocol', {
            command: 'Storage.clearDataForOrigin',
            params: {
                origin: Cypress.config('baseUrl'),
                storageTypes: 'cache_storage,indexeddb',
            },
        }),
        { log: false }
    )

// \s also matches the no-break spaces of French number formats
// "19 090" -> 19090, "1 234,56" -> 1234.56 (French format used by MetricsCard)
export const parseDisplayedNumber = (text) =>
    Number(text.replace(/\s/g, '').replace(',', '.'))

// Current period (YYYYMM) in the server time zone, as the app computes it
export const fetchServerPeriod = () =>
    cy
        .request(`${getApiBaseUrl()}/api/system/info?fields=serverDate`)
        .its('body.serverDate')
        .then((serverDate) => serverDate.slice(0, 7).replace('-', ''))

const fetchIdsByCode = (resource, codes) =>
    cy
        .request({
            url: `${getApiBaseUrl()}/api/${resource}`,
            qs: {
                filter: `code:in:[${codes.join(',')}]`,
                fields: 'id,code',
                paging: false,
            },
        })
        .its(`body.${resource}`)

// Resolves codes to ids through /api/indicators and /api/dataElements.
// Fails with the list of codes that matched nothing.
export const resolveIdsByCode = (codes) =>
    fetchIdsByCode('indicators', codes).then((indicators) =>
        fetchIdsByCode('dataElements', codes).then((dataElements) => {
            const idByCode = Object.fromEntries(
                [...indicators, ...dataElements].map(({ id, code }) => [
                    code,
                    id,
                ])
            )
            const missing = codes.filter((code) => !idByCode[code])
            expect(missing, 'codes introuvables sur l’instance').to.be.empty
            return idByCode
        })
    )

// Returns { [dxId]: number } from /api/analytics for one period and org unit
export const fetchAnalyticsValues = ({ dxIds, period, orgUnitId }) =>
    cy
        .request({
            url: `${getApiBaseUrl()}/api/analytics`,
            qs: {
                dimension: [
                    `dx:${dxIds.join(';')}`,
                    `pe:${period}`,
                    `ou:${orgUnitId}`,
                ],
            },
        })
        .its('body')
        .then(({ headers, rows }) => {
            const col = (name) => headers.findIndex((h) => h.name === name)
            const dxCol = col('dx')
            const valueCol = col('value')
            return Object.fromEntries(
                rows.map((row) => [row[dxCol], Number(row[valueCol])])
            )
        })
