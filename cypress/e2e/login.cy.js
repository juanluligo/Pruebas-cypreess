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


describe('CP-23 - Inyección SQL (SQLi) en campo de correo electrónico', () => {
  it('no permite iniciar sesión mediante una inyección SQL', () => {
    cy.visit('https://nova.uniautonoma.edu.co/login');

    cy.get('[name="email"]').type("' OR '1'='1");
    cy.get('input[type="password"]').type('CualquierClave123*');

    cy.get('.space-y-4 > .inline-flex').click();

    cy.url().should('include', '/login');
  })
})


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


describe('CP-26 - Control de ataques de fuerza bruta por intentos fallidos reiterados', () => {
  it('activa una medida de protección después de varios intentos fallidos', () => {
    cy.env(['BRUTE_FORCE_TEST_EMAIL', 'BRUTE_FORCE_WRONG_PASSWORD'])
      .then(({ BRUTE_FORCE_TEST_EMAIL, BRUTE_FORCE_WRONG_PASSWORD }) => {
        expect(BRUTE_FORCE_TEST_EMAIL, 'Configura CYPRESS_BRUTE_FORCE_TEST_EMAIL')
          .to.be.a('string')
          .and.match(/@uniautonoma\.edu\.co$/);
        expect(BRUTE_FORCE_WRONG_PASSWORD, 'Configura CYPRESS_BRUTE_FORCE_WRONG_PASSWORD')
          .to.be.a('string')
          .and.not.be.empty;

        cy.visit('https://nova.uniautonoma.edu.co/login');
        cy.intercept('POST', '**/api/login/').as('loginRequest');

        for (let attempt = 1; attempt <= 5; attempt++) {
          cy.get('[name="email"]').clear().type(BRUTE_FORCE_TEST_EMAIL);
          cy.get('input[type="password"]').clear().type(BRUTE_FORCE_WRONG_PASSWORD);
          cy.get('.space-y-4 > .inline-flex').click();
          cy.wait('@loginRequest');
        }

        cy.get('[name="email"]').clear().type(BRUTE_FORCE_TEST_EMAIL);
        cy.get('input[type="password"]').clear().type(BRUTE_FORCE_WRONG_PASSWORD);
        cy.get('.space-y-4 > .inline-flex').then(($button) => {
          if (!$button.is(':disabled')) {
            cy.wrap($button).click();
          }
        });

        cy.get('body', { timeout: 10000 }).should(($body) => {
          const texto = $body.text().toLowerCase();
          const proteccionVisible = /bloque|captcha|demasiados intentos|rate.?limit|too many|temporar/.test(texto);
          const botonBloqueado = $body
            .find('button')
            .filter((_, button) => button.textContent.includes('Iniciar Sesión'))
            .is(':disabled');

          expect(proteccionVisible || botonBloqueado).to.be.true;
        });
      });
  })
})


describe('CP-10 - Inicio de sesión federado con Google institucional', () => {
  it('muestra el acceso de Google para iniciar sesión', () => {
    cy.visit('https://nova.uniautonoma.edu.co/login');

    cy.get('iframe[src*="accounts.google.com"]')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('include', 'accounts.google.com');
  })
})


describe('CP-27 - Cifrado de canal en tránsito y redirección forzada a HTTPS', () => {
  it('redirige de HTTP a HTTPS', () => {
    cy.request({
      url: 'http://nova.uniautonoma.edu.co/login',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([301, 302]);
      expect(response.headers.location).to.match(/^https:\/\//);
    });
  })
})


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
