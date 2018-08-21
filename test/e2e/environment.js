/* eslint-disable init-declarations, no-console */
const puppeteer = require('puppeteer');
const { createServer } = require('http');
const app = require('app');

let browser;
let server;

function startAppServer(port, testUrl) {
  if (!server && testUrl.indexOf('localhost') !== -1) {
    console.log(`Starting server on port ${port}`);
    server = createServer(app.create({ disableAppInsights: true })).listen(port);
  }
}

async function startBrowser() {
  if (!browser) {
    console.log('Starting browser');
    const opts = {
      args: [
        '--no-sandbox',
        '--start-maximized'
      ],
      headless: true,
      timeout: 10000,
      ignoreHTTPSErrors: true
    };
    browser = await puppeteer.launch(opts);
  }
}

async function launchBrowser() {
  await startBrowser();
  const page = await browser.newPage();
  await page.setViewport({
    height: 700,
    width: 1100
  });
  return { page };
}

after(async() => {
  if (server && server.close) {
    console.log('Killing server');
    server.close();
  }
  if (browser && browser.close) {
    console.log('Killing browser');
    await browser.close();
  }
});

module.exports = { startAppServer, launchBrowser };
