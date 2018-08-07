const { expect, sinon } = require('test/chai-sinon');
const helloWorld = require('app/middleware/hello-world');

/* eslint-disable init-declarations */
describe('middleware/helloWorld', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      render: sinon.spy()
    };
  });

  it('renders hello world page', () => {
    helloWorld(req, res);
    expect(res.render).to.have.been.calledOnce.calledWith('hello-world.html');
  });
});
