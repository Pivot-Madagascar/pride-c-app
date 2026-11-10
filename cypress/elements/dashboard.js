// Loading all the indicators can be long (the app itself gives up after 2 min)
export const DATA_LOAD_TIMEOUT = 120000

export const DASHBOARD_CARDS = [
    { title: 'Paludisme', path: '/malaria-trend' },
    { title: 'Maladies diarrheiques', path: '/diarrhea-trend' },
    { title: 'IRA', path: '/ira-trend' },
]

export const visitDashboard = () => cy.visit('/')

export const getDashboard = () =>
    cy.getByDataTest('dashboard-container', { timeout: DATA_LOAD_TIMEOUT })

export const getDashboardTitle = () => cy.getByDataTest('dashboard-title')

export const getDashboardCardLinks = () =>
    cy.getByDataTest('dashboard-card-link')

export const getAppLoader = () => cy.getByDataTest('app-loader')
