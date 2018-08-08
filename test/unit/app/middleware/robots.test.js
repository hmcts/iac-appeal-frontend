const { expect, sinon } = require('test/chai-sinon');
const robots = require('app/middleware/robots');

/* eslint-disable init-declarations */
describe('middleware/robots', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      type: sinon.spy(),
      send: sinon.spy()
    };
  });

  it('returns TEXT with robots disallow rule', () => {
    robots(req, res);
    expect(res.send).to.have.been.calledOnce.calledWith('User-agent: *\nDisallow: /');
  });
});
