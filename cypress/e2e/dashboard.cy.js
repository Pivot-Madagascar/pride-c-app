import {
    DASHBOARD_CARDS,
    getAppLoader,
    getDashboard,
    getDashboardCardLinks,
    getDashboardTitle,
    visitDashboard,
} from '../elements/dashboard'
import { parentOrgUnit } from '../fixtures/backend'

describe('Dashboard (/)', () => {
    // Visiting in a test, not in before(): a spec-level before() runs ahead of
    // the global beforeEach() that restores the DHIS2 session cookie.
    it('loads the dashboard and hides the loader once the data is fetched', () => {
        visitDashboard()
        getDashboard().should('be.visible')
        getAppLoader().should('not.exist')
    })

    it('shows the prediction title for the parent district', () => {
        getDashboardTitle()
            .should('be.visible')
            .and('contain', 'Prédiction entre le mois de')
            .and('contain', parentOrgUnit.displayName)
    })

    it('shows one statistic card per disease', () => {
        getDashboardCardLinks().should('have.length', DASHBOARD_CARDS.length)
        DASHBOARD_CARDS.forEach(({ title }, index) => {
            getDashboardCardLinks()
                .eq(index)
                .findByDataTest('dashboard-card-title')
                .should('contain', title)
        })
    })

    DASHBOARD_CARDS.forEach(({ title, path }, index) => {
        it(`opens the ${title} trend page from its card`, () => {
            visitDashboard()
            getDashboard().should('be.visible')
            getDashboardCardLinks().eq(index).click()
            // The app uses a hash router: routes live in location.hash
            cy.location('hash').should('eq', `#${path}`)
            cy.getByDataTest('error-page').should('not.exist')
        })
    })
})
