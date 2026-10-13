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


describe('CP-13 - Envío con formulario totalmente vacío', () => {
  it('passes', () => {
    cy.visit('https://nova.uniautonoma.edu.co/login');
    cy.get('.space-y-4 > .inline-flex').click();
    cy.get(':nth-child(1) > .text-red-600').should('contain', 'El correo es requerido');
    cy.get(':nth-child(2) > .text-red-600').should('contain', 'La contraseña es requerida');
  })
})


describe('CP-14 - Envío con campo de correo electrónico vacío', () => {
  it('passes', () => { // invalida
    cy.visit('https://nova.uniautonoma.edu.co/login');

    cy.get('input[type="password"]').type('CualquierPassword123*');

    cy.get('.space-y-4 > .inline-flex').click();

    (cy.contains('El correo es requerido') ?? cy.contains('El correo electrónico es obligatorio')).should('be.visible');
  })
})

describe('CP-15 - Envío con campo de contraseña vacío', () => {
  it('passes', () => { // invalida
    cy.visit('https://nova.uniautonoma.edu.co/login');

    cy.get('[name="email"]').type('usuario@uniautonoma.edu.co ');

    cy.get('.space-y-4 > .inline-flex').click();

    cy.contains('La contraseña es requerida').should('be.visible');
  })
})


describe('CP-16 - Formato de correo sin carácter arroba (@)', () => {
  it('passes', () => { // invalida
    cy.visit('https://nova.uniautonoma.edu.co/login');

    cy.get('[name="email"]').type('usuariouniautonoma.edu.co');
    cy.get('input[type="password"]').type('Password123*');

    cy.get('.space-y-4 > .inline-flex').click();

    cy.get('input[type="email"]').should('match', ':invalid');
  })
})


describe('CP-17 - Formato de correo incompleto sin dominio', () => {
  it('passes', () => { // invalida
    cy.visit('https://nova.uniautonoma.edu.co/login');

    cy.get('[name="email"]').type('usuario@');
    cy.get('input[type="password"]').type('Password123*');

    cy.get('.space-y-4 > .inline-flex').click();

    cy.get('input[type="email"]').should('match', ':invalid');
  })
})
