describe('CP-10 - Inicio de sesión federado con Google institucional', () => {
  it('muestra el acceso de Google para iniciar sesión', () => {
    cy.visit('https://nova.uniautonoma.edu.co/login');

    cy.get('iframe[src*="accounts.google.com"]')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('include', 'accounts.google.com');
  })
})
