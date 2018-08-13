const { Express } = require('@hmcts/nodejs-logging');

const appInsights = require('./app-insights');
const express = require('express');
const nunjucks = require('nunjucks');
const security = require('./security');

const locale = require('./app/locale/en.json');
const routes = require('./app/routes');

const notFoundHandler = require('./app/middleware/errors/404-not-found');
const internalServerErrorHandler = require('./app/middleware/errors/500-internal-server-error');

function create(options) {
  const opts = options || {};
  if (!opts.disableAppInsights) {
    appInsights.enable();
  }

  const app = express();

  security.apply(app);

  nunjucks.configure([
    './app/views',
    './node_modules/govuk-frontend/',
    './node_modules/govuk-frontend/components/'
  ], {
    autoescape: true,
    express: app
  });

  app.use(Express.accessLogger());

  app.use('/assets', express.static('./public/govuk-frontend/assets'));
  app.use('/public', express.static('./public'));
  app.use('/', routes);
  app.use(notFoundHandler);
  app.use(internalServerErrorHandler);

  app.locals.i18n = locale;

  return app;
}

module.exports = { create };
