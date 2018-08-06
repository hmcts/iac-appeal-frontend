/* eslint-disable no-process-env */
const config = require('config');

exports.config = {
  tests: './**/*.test.js',
  output: process.env.TEST_SMOKE_OUTPUT_DIR || config.get('test.smokeOutputDir'),
  timeout: 1000,
  helpers: {
    Puppeteer: {
      url: process.env.TEST_URL || config.get('test.url'),
      waitForTimeout: parseInt(config.get('test.waitForTimeout')),
      waitForAction: parseInt(config.get('test.waitForAction')),
      waitForNavigation: 'networkidle0',
      show: false,
      windowSize: '1000x1000',
      chrome: {
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox']
      }
    }
  },
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {steps: true}
      },
      mochawesome: {
        options: {
          reportDir: process.env.TEST_SMOKE_OUTPUT_DIR || config.get('test.smokeOutputDir'),
          reportName: 'index',
          inlineAssets: true
        }
      }
    }
  },
  name: 'Immigration & Asylum smoke tests'
};
