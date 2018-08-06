const paths = require('paths');

Feature('Smoke test');

Scenario('Hello world page', I => {
  I.amOnPage(paths.helloWorld);
  I.see('Hello world');
});
