const { expect } = require('test/chai-sinon');
const SinglePage = require('test/e2e/single-page');
const { helloWorld } = require('app/paths');

describe('Hello world page', () => {
  /* eslint-disable init-declarations */
  let helloWorldPage;
  /* eslint-enable init-decalarations */

  before(async() => {
    helloWorldPage = new SinglePage(helloWorld);
    await helloWorldPage.open();
  });

  after(async() => {
    await helloWorldPage.close();
  });

  it('is on the /hello-world path', () => {
    helloWorldPage.verifyPath();
  });

  it('has Hello world heading', async() => {
    await helloWorldPage.captureScreenshot('hello-world');
    expect(await helloWorldPage.getHeading()).to.equal('Hello world');
  });
});
