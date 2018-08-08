const healthCheck = require('@hmcts/nodejs-healthcheck');
const childProcess = require('child_process');
const cache = require('memory-cache');

function checkNodeModules() {
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
    checkNodeModules();
    res.json(healthCheck.up());
  } catch (error) {
    res.json(healthCheck.down());
  }
};
