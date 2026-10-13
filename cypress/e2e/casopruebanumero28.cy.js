describe('CP-28 - Protección de credenciales en parámetros HTTP y herramientas de desarrollo', () => {
  it('envía la contraseña por POST y no la expone en la URL ni en el referer', () => {
    const email = 'noexiste@uniautonoma.edu.co';
    const password = 'CualquierClave123*';

    cy.visit('https://nova.uniautonoma.edu.co/login');
    cy.intercept('POST', '**/api/login/').as('loginRequest');

    cy.get('[name="email"]').type(email);
    cy.get('input[type="password"]').type(password, { log: false });
    cy.get('.space-y-4 > .inline-flex').click();

    cy.wait('@loginRequest').then(({ request }) => {
      expect(request.method).to.equal('POST');
      expect(request.url).not.to.include(password);
      expect(request.headers.referer || '').not.to.include(password);
      expect(request.body.password).to.equal(password);
    });
  })
})
