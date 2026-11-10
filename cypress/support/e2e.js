import '@dhis2/cypress-commands'
import './commands'

const SESSION_COOKIE = 'JSESSIONID'
const findSession = (baseUrl, cookies) =>
    cookies.find((c) => c.name === SESSION_COOKIE && baseUrl.includes(c.path))

// ResizeObserver throws benign errors that must not fail the tests
Cypress.on('uncaught:exception', (err) =>
    err.message.includes('ResizeObserver') ? false : undefined
)

before(() => {
    const baseUrl = Cypress.env('dhis2BaseUrl')
    // On DHIS2 2.40, /api/auth/login does not exist: loginByApi falls back
    // to the legacy dhis-web-commons-security/login.action endpoint.
    cy.loginByApi({
        username: Cypress.env('dhis2Username'),
        password: Cypress.env('dhis2Password'),
        baseUrl,
    })
        .its('status')
        .should('equal', 200)

    cy.getAllCookies().then((cookies) => {
        const session = findSession(baseUrl, cookies)
        expect(session, 'cookie de session DHIS2').to.exist
        Cypress.env('dhis2Session', JSON.stringify(session))
    })
})

beforeEach(() => {
    const baseUrl = Cypress.env('dhis2BaseUrl')
    const { name, value, ...options } = JSON.parse(Cypress.env('dhis2Session'))
    localStorage.setItem('DHIS2_BASE_URL', baseUrl)
    // The instance sends JSESSIONID without a SameSite attribute, so recent
    // Chrome treats it as Lax and drops it on cross-site requests from
    // localhost (chromeAllowXSiteCookies no longer helps). The cookie is
    // Secure, so it can be restored as SameSite=None.
    cy.setCookie(name, value, { ...options, sameSite: 'no_restriction' })
})
