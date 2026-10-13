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
