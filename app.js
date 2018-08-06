const { Express } = require('@hmcts/nodejs-logging');

const appInsights = require('app-insights');
const express = require('express');
const locale = require('app/locale/en.json');
const nunjucks = require('nunjucks');
const routes = require('app/routes');

const notFoundHandler = require('app/middleware/errors/404-not-found');
const internalServerErrorHandler = require('app/middleware/errors/500-internal-server-error');

function setup(options) {
  const opts = options || {};
  if (!opts.disableAppInsights) {
    appInsights.enable();
  }

  const app = express();

  require("security.js")(app);

  nunjucks.configure([
    'app/views',
    'node_modules/govuk-frontend/',
    'node_modules/govuk-frontend/components/'
  ], {
    autoescape: true,
    express: app
  });

  app.use(Express.accessLogger());

  app.use('/public', express.static(`${__dirname}/public`));
  app.use('/', routes);
  app.use(notFoundHandler);
  app.use(internalServerErrorHandler);

  app.locals.i18n = locale;

  return app;
}

module.exports = { setup };
