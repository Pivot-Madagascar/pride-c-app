const { chromeAllowXSiteCookies } = require('@dhis2/cypress-plugins')
const { defineConfig } = require('cypress')

module.exports = defineConfig({
    // Required: the session cookie of a remote HTTPS instance is used from localhost
    chromeWebSecurity: false,
    e2e: {
        setupNodeEvents(on, config) {
            chromeAllowXSiteCookies(on, config)
            if (!config.env.dhis2BaseUrl) {
                throw new Error(
                    'dhis2BaseUrl manquant : voir cypress.env.json ou les variables CYPRESS_*'
                )
            }
            return config
        },
        baseUrl: 'http://localhost:3000',
        specPattern: 'cypress/e2e/**/*.cy.js',
        viewportWidth: 1280,
        viewportHeight: 960,
        defaultCommandTimeout: 15000,
        testIsolation: false, // specs with sequential steps
        video: true,
        experimentalMemoryManagement: true,
        numTestsKeptInMemory: 5,
        retries: { runMode: 1, openMode: 0 },
    },
})
