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
