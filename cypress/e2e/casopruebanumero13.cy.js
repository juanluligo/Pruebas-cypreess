describe('CP-13 - Envío con formulario totalmente vacío', () => {
  it('passes', () => {
    cy.visit('https://nova.uniautonoma.edu.co/login');
    cy.get('.space-y-4 > .inline-flex').click();
    cy.get(':nth-child(1) > .text-red-600').should('contain', 'El correo es requerido');
    cy.get(':nth-child(2) > .text-red-600').should('contain', 'La contraseña es requerida');
  })
})
