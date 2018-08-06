const {helloWorld} = require('paths');
const BasePage = require('test/functional/page-objects/base');

class HelloWorldPage extends BasePage {
  constructor(page) {
    super(page);
    this.pagePath = helloWorld;
  }
}

module.exports = HelloWorldPage;
