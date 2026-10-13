describe('CP-08 - Mostrar contraseña en texto plano', () => {
  it('muestra la contraseña al hacer clic en el ícono del ojo', () => {
    cy.visit('https://nova.uniautonoma.edu.co/login');

    cy.get('input[type="password"]').type('CualquierClave123*');
    cy.get('input[type="password"]').parent().find('button').click();

    cy.get('input[placeholder="••••••••"]')
      .should('have.attr', 'type', 'text')
      .and('have.value', 'CualquierClave123*');
  })
})
