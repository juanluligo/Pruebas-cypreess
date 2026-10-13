describe('CP-23 - Inyección SQL (SQLi) en campo de correo electrónico', () => {
  it('no permite iniciar sesión mediante una inyección SQL', () => {
    cy.visit('https://nova.uniautonoma.edu.co/login');

    cy.get('[name="email"]').type("' OR '1'='1");
    cy.get('input[type="password"]').type('CualquierClave123*');

    cy.get('.space-y-4 > .inline-flex').click();

    cy.url().should('include', '/login');
  })
})
