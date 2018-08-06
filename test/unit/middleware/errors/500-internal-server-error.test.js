const {expect, sinon} = require('test/chai-sinon');
const {INTERNAL_SERVER_ERROR} = require('http-status-codes');
const internalServerErrorHandler = require('app/middleware/errors/500-internal-server-error');

/* eslint-disable init-declarations */
describe('middleware/500-internal-server-error', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: sinon.spy(),
      render: sinon.spy()
    };
  });

  it('gives 500 page', () => {
    const error = new Error('Error for test purpose');
    internalServerErrorHandler(error, req, res);
    expect(res.status).to.have.been.calledOnce.calledWith(INTERNAL_SERVER_ERROR);
    expect(res.render).to.have.been.calledOnce.calledWith('errors/500-internal-server-error.html');
  });
});
