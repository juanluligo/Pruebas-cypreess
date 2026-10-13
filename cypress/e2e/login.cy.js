describe('Ficha Técnica: CP-04 - Intento de inicio de sesión con correo no registrado', () => {

  afterEach(() => {
    
    cy.get('[name="email"]').clear();
    cy.get('input[type="password"]').clear();
  });

  it('passes', () => {
    cy.visit('https://nova.uniautonoma.edu.co/login');

    cy.get('[name="email"]').type('noexiste@uniautonoma.edu.co');
    cy.get('input[type="password"]').type('CualquierClave123*');

    cy.get('.space-y-4 > .inline-flex').click();

    cy.get('#root > div > section > ol > li > div:nth-child(2) > div:nth-child(2)').should('contain', 'No active account found with the given credentials')
  })
})
