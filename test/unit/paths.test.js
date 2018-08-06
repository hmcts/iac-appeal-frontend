const { expect } = require('test/chai-sinon');
const paths = require('paths');

describe('paths.js', () => {

  it('should return path for helloWorld', () => {
    expect(paths).to.have.property('health').that.equals('/health');
    expect(paths).to.have.property('helloWorld').that.equals('/hello-world');
    expect(paths).to.have.property('robots').that.equals('/robots.txt');
  });
});
