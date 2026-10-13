describe('CP-14 - Envío con campo de correo electrónico vacío', () => {
  it('passes', () => { // invalida
    cy.visit('https://nova.uniautonoma.edu.co/login');

    cy.get('input[type="password"]').type('CualquierPassword123*');

    cy.get('.space-y-4 > .inline-flex').click();

    (cy.contains('El correo es requerido') ?? cy.contains('El correo electrónico es obligatorio')).should('be.visible');
  })
})
