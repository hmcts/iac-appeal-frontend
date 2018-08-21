const { expect, sinon } = require('test/chai-sinon');
const { NOT_FOUND } = require('http-status-codes');
const notFoundHandler = require('app/middleware/errors/404-not-found');

/* eslint-disable init-declarations */
describe('middleware/errors/404-not-found', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: sinon.spy(),
      render: sinon.spy()
    };
  });

  it('gives 404 page', () => {
    notFoundHandler(req, res);
    expect(res.status).to.have.been.calledOnce.calledWith(NOT_FOUND);
    expect(res.render).to.have.been.calledOnce.calledWith('errors/404-not-found.html');
  });
});
