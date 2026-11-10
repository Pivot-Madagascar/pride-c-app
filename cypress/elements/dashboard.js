// Loading all the indicators can be long (the app itself gives up after 2 min)
export const DATA_LOAD_TIMEOUT = 120000

// In display order. `disease` matches the keys of dashboardAlertCodes.
export const DASHBOARD_CARDS = [
    { disease: 'malaria', title: 'Paludisme', path: '/malaria-trend' },
    {
        disease: 'diarrhea',
        title: 'Maladies diarrheiques',
        path: '/diarrhea-trend',
    },
    { disease: 'ira', title: 'IRA', path: '/ira-trend' },
]

// Indicator names shown on each card, in display order
export const CARD_INDICATORS = [
    'incidence',
    'csbCases',
    'comCases',
    'csbVigilance',
]

export const visitDashboard = () => cy.visit('/')

export const getDashboard = () =>
    cy.getByDataTest('dashboard-container', { timeout: DATA_LOAD_TIMEOUT })

export const getDashboardTitle = () => cy.getByDataTest('dashboard-title')

export const getDashboardCardLinks = () =>
    cy.getByDataTest('dashboard-card-link')

export const getStatisticCard = (index) =>
    cy.getByDataTest('dashboard-statistic-card').eq(index)

export const getCardMetric = (cardIndex, indicator) =>
    getStatisticCard(cardIndex).findByDataTest(`metrics-card-${indicator}`)

export const getAppLoader = () => cy.getByDataTest('app-loader')
