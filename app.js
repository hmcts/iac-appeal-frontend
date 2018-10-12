const { Express } = require('@hmcts/nodejs-logging');

const appInsights = require('./app-insights');
const express = require('express');
const nunjucks = require('nunjucks');
const security = require('./security');

const cookieParser = require('cookie-parser');
const locale = require('./app/locale/en.json');
const paths = require('./app/paths');
const routes = require('./app/routes');

const caseLoader = require('./app/middleware/case-loader');
const requestParser = require('./app/middleware/request-parser');
const documentExchanger = require('./app/middleware/document-exchanger');
const internalServerErrorHandler = require('./app/middleware/errors/500-internal-server-error');
const notFoundHandler = require('./app/middleware/errors/404-not-found');
const serviceTokenHeader = require('./app/middleware/auth/service-token-header');
const userAuthentication = require('./app/middleware/auth/user-authentication');

function create(options) {
  const opts = options || {};
  if (!opts.disableAppInsights) {
    appInsights.enable();
  }

  const app = express();

  security.apply(app);

  const nunjucksEnvironment = nunjucks.configure([
    './app/views',
    './node_modules/govuk-frontend/',
    './node_modules/govuk-frontend/components/',
    './node_modules/@hmcts/frontend/',
    './node_modules/@hmcts/frontend/components/'
  ], {
    autoescape: true,
    express: app
  });

  nunjucksEnvironment.addFilter('is_array', o => Array.isArray(o));

  app.use(Express.accessLogger());
  app.use(cookieParser());
  app.use(requestParser);

  app.use('/assets', express.static('./public/govuk-frontend/assets'));
  app.use('/public', express.static('./public'));

  app.use(paths.securedPath, serviceTokenHeader);
  app.use(paths.securedPath, userAuthentication);
  app.use(paths.securedPath, caseLoader);
  app.use(paths.securedPath, documentExchanger);

  app.use('/', routes);
  app.use(notFoundHandler);
  app.use(internalServerErrorHandler);

  app.locals.i18n = locale;

  return app;
}

module.exports = { create };
