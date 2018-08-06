const {expect} = require('test/chai-sinon');
const config = require('config');
const fs = require('fs');

const testUrl = config.get('test.url');
const functionalOutputDir = config.get('test.functionalOutputDir');

class BasePage {
  constructor(page) {
    this.page = page;
    this.pagePath = '/';
  }

  async visitPage() {
    await this.page.goto(`${testUrl}${this.pagePath}`);
  }

  verifyPage() {
    expect(this.page.url()).to.equal(`${testUrl}${this.pagePath}`);
  }

  async getHeading() {
    const heading = await this.page.$eval('h1', el => el.innerHTML);
    return heading;
  }

  async screenshot(filename) {

    if (!fs.existsSync(functionalOutputDir)) {
      fs.mkdirSync(functionalOutputDir);
    }

    await this.page.screenshot({
      fullPage: true,
      path: `${functionalOutputDir}/${filename}.png`
    });
  }
}

module.exports = BasePage;
