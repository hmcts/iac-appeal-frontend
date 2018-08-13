const { expect, sinon } = require('test/chai-sinon');
const health = require('app/middleware/health');
const cache = require('memory-cache');
const childProcess = require('child_process');

/* eslint-disable init-declarations */
describe('middleware/health', () => {
  let cachePut;
  let execSync;
  let req;
  let res;

  beforeEach(() => {
    cachePut = sinon.stub(cache, 'put');
    execSync = sinon.stub(childProcess, 'execSync');
    req = {};
    res = {
      json: sinon.spy()
    };
  });

  afterEach(() => {
    cachePut.restore();
    execSync.restore();
  });

  it('returns health UP as JSON when modules are OK', () => {
    health(req, res);

    expect(res.json).to.have.been.calledOnce.calledWith({ status: 'UP' });
  });

  it('returns health DOWN as JSON when modules are not OK', () => {
    execSync.throws(1);
    health(req, res);

    expect(res.json).to.have.been.calledOnce.calledWith({ status: 'DOWN' });
  });
});
