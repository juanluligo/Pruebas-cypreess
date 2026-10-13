describe('CP-16 - Formato de correo sin carácter arroba (@)', () => {
  it('passes', () => { // invalida
    cy.visit('https://nova.uniautonoma.edu.co/login');

    cy.get('[name="email"]').type('usuariouniautonoma.edu.co');
    cy.get('input[type="password"]').type('Password123*');

    cy.get('.space-y-4 > .inline-flex').click();

    cy.get('input[type="email"]').should('match', ':invalid');
  })
})
