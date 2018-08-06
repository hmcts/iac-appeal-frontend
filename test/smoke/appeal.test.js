const paths = require('paths');

Feature('Smoke test');

Scenario('Welcome page', I => {
    I.amOnPage(paths.health);
    I.see('"status":"UP"');
});
