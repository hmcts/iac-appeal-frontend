const { expect } = require('test/chai-sinon');
const config = require('config');
const fs = require('fs');
const { startAppServer, launchBrowser } = require('test/e2e/environment');

const port = config.get('node.port');
const testUrl = config.get('test.url');
const outputDir = config.get('test.outputDir');

class SinglePage {
  constructor(pagePath) {
    this.pagePath = typeof pagePath === 'undefined' ? '/' : pagePath;
  }

  async open() {
    startAppServer(port, testUrl);
    if (typeof this.page === 'undefined') {
      const browser = await launchBrowser();
      this.page = browser.page;
    }
    await this.page.goto(`${testUrl}${this.pagePath}`, {
      timeout: 60000
    });
  }

  async close() {
    if (this.page && this.page.close) {
      await this.page.close();
    }
  }

  verifyPath() {
    expect(this.page.url()).to.equal(`${testUrl}${this.pagePath}`);
  }

  async getHeading() {
    const heading = await this.page.$eval('h1', el => el.innerHTML);
    return heading;
  }

  async getRawBody() {
    await this.page.content();
    return this.page.$eval('body', el => el.innerText);
  }

  async captureScreenshot(filename) {
    /* eslint-disable no-sync */
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    /* eslint-enable no-sync */

    await this.page.screenshot({
      fullPage: true,
      path: `${outputDir}/${filename}.png`
    });
  }
}

module.exports = SinglePage;
