describe('CP-17 - Formato de correo incompleto sin dominio', () => {
  it('passes', () => { // invalida
    cy.visit('https://nova.uniautonoma.edu.co/login');

    cy.get('[name="email"]').type('usuario@');
    cy.get('input[type="password"]').type('Password123*');

    cy.get('.space-y-4 > .inline-flex').click();

    cy.get('input[type="email"]').should('match', ':invalid');
  })
})
