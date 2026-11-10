import {
    CARD_INDICATORS,
    DASHBOARD_CARDS,
    getCardMetric,
    getDashboard,
    getDashboardTitle,
    visitDashboard,
} from '../elements/dashboard'
import { dashboardAlertCodes, parentOrgUnit } from '../fixtures/backend'
import {
    clearAppCache,
    fetchAnalyticsValues,
    fetchServerPeriod,
    parseDisplayedNumber,
    resolveIdsByCode,
} from '../support/utils'

// MetricsCard rounds to 2 decimals
const round2 = (value) => Math.round(value * 100) / 100

const monthName = (period) =>
    new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(
        new Date(Number(period.slice(0, 4)), Number(period.slice(4, 6)) - 1, 1)
    )

const allCodes = Object.values(dashboardAlertCodes).flatMap((indicators) =>
    Object.values(indicators)
)

const assertMetric = (cardIndex, indicator, expected) => {
    const metric = getCardMetric(cardIndex, indicator)
    if (expected) {
        metric.findByDataTest('metrics-card-value').should(($value) => {
            expect(
                parseDisplayedNumber($value.text()),
                `${DASHBOARD_CARDS[cardIndex].title} / ${indicator}`
            ).to.equal(round2(expected))
        })
    } else {
        // No value (or 0) on the server: the card shows "Information non disponible"
        metric.findByDataTest('metrics-card-unavailable').should('exist')
        getCardMetric(cardIndex, indicator)
            .findByDataTest('metrics-card-value')
            .should('not.exist')
    }
}

describe('Dashboard (/): values match DHIS2', () => {
    // Filled by the first test, read by the following ones (testIsolation: false)
    let period
    let idByCode
    let expected // { malaria: { incidence: 19090, ... }, ... }

    after(() => {
        // Do not leave empty or partial data in the app cache for other specs
        clearAppCache()
    })

    it('fetches the expected values from the DHIS2 API', () => {
        fetchServerPeriod()
            .then((serverPeriod) => {
                period = serverPeriod
                return resolveIdsByCode(allCodes)
            })
            .then((ids) => {
                idByCode = ids
                return fetchAnalyticsValues({
                    dxIds: Object.values(ids),
                    period,
                    orgUnitId: parentOrgUnit.id,
                })
            })
            .then((valueById) => {
                expected = Object.fromEntries(
                    Object.entries(dashboardAlertCodes).map(
                        ([disease, indicators]) => [
                            disease,
                            Object.fromEntries(
                                Object.entries(indicators).map(
                                    ([indicator, code]) => [
                                        indicator,
                                        valueById[idByCode[code]],
                                    ]
                                )
                            ),
                        ]
                    )
                )
                cy.log(`Période ${period}`, JSON.stringify(expected))
            })
    })

    it('loads the dashboard from DHIS2 with an empty app cache', () => {
        clearAppCache()
        visitDashboard()
        getDashboard().should('be.visible')
        // The app and the test work on the same period
        getDashboardTitle().should('contain', monthName(period))
    })

    DASHBOARD_CARDS.forEach(({ disease, title }, cardIndex) => {
        it(`shows the DHIS2 values on the ${title} card`, () => {
            CARD_INDICATORS.forEach((indicator) => {
                assertMetric(cardIndex, indicator, expected[disease][indicator])
            })
        })
    })

    it('shows "Information non disponible" when DHIS2 returns no value', () => {
        const alertIds = Object.values(idByCode)
        // Edge case: answer the dashboard alert analytics requests with no rows
        cy.intercept(
            { method: 'GET', url: /\/api\/(\d+\/)?analytics\?/ },
            (req) => {
                if (alertIds.some((id) => req.url.includes(id))) {
                    req.alias = 'alertAnalytics'
                    // Keep the real response shape, only drop the values
                    req.continue((res) => {
                        res.body.rows = []
                        res.body.height = 0
                    })
                }
            }
        )

        clearAppCache()
        visitDashboard()
        cy.wait('@alertAnalytics')
        getDashboard().should('be.visible')

        DASHBOARD_CARDS.forEach((card, cardIndex) => {
            CARD_INDICATORS.forEach((indicator) => {
                assertMetric(cardIndex, indicator, null)
            })
        })
    })
})
