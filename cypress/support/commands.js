Cypress.Commands.add('getByDataTest', (sel, ...args) =>
    cy.get(`[data-test="${sel}"]`, ...args)
)

Cypress.Commands.add(
    'findByDataTest',
    { prevSubject: true },
    (subject, sel, ...args) =>
        cy.wrap(subject).find(`[data-test="${sel}"]`, ...args)
)
