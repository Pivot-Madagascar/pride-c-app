import { getDashboard, visitDashboard } from '../elements/dashboard'

describe('Smoke', () => {
    it('loads the app with the DHIS2 header bar and the main screen', () => {
        visitDashboard()
        cy.getByDataTest('headerbar-title').should('be.visible')
        getDashboard().should('be.visible')
        cy.getByDataTest('error-page').should('not.exist')
    })
})
