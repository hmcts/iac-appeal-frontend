const healthCheck = require('@hmcts/nodejs-healthcheck');
const childProcess = require('child_process');
const memoryCache = require('memory-cache');

function checkNodeModules(cache) {
  if (!cache.get('health/modules-ok')) {
    /* eslint-disable no-sync */
    childProcess.execSync(
      'node ./node_modules/yarn/bin/yarn.js check ' +
      '--production ' +
      '--no-progress ' +
      '--non-interactive'
    );
    /* eslint-enable no-sync */
    cache.put('health/modules-ok', true);
  }
}

module.exports = (req, res) => {
  try {
    checkNodeModules(memoryCache);
    res.json(healthCheck.up());
  } catch (error) {
    res.json(healthCheck.down());
  }
};
