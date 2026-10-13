describe('CP-15 - Envío con campo de contraseña vacío', () => {
  it('passes', () => { // invalida
    cy.visit('https://nova.uniautonoma.edu.co/login');

    cy.get('[name="email"]').type('usuario@uniautonoma.edu.co ');

    cy.get('.space-y-4 > .inline-flex').click();

    cy.contains('La contraseña es requerida').should('be.visible');
  })
})
