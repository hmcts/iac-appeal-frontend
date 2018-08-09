const { expect } = require('test/chai-sinon');
const SinglePage = require('test/e2e/single-page');
const { health } = require('app/paths');

describe('@smoke tests', () => {
  /* eslint-disable init-declarations */
  let healthPage;
  /* eslint-enable init-decalarations */

  before(async() => {
    healthPage = new SinglePage(health);
    await healthPage.open();
  });

  after(async() => {
    await healthPage.close();
  });

  it('health check says application is UP', async() => {
    const content = JSON.parse(await healthPage.getRawBody());
    expect(content.status).to.equal('UP');
  });
});
