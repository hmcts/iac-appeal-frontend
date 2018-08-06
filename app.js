const { Logger, Express } = require('@hmcts/nodejs-logging');
const config = require('config');
const express = require('express');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const helmet = require('helmet');
const logger = Logger.getLogger('app.js');
const os = require('os');
const nunjucks = require('nunjucks');
const routes = require('app/routes');

const app = express();
const protocol = config.get('node.protocol');
const hostname = config.get('node.hostname');
const port = config.get('node.port');

let baseUrl = `${protocol}://${hostname}`;
if (process.env.NODE_ENV === 'development') {
    baseUrl = `${baseUrl}:${port}`;
}

logger.info('I&A appeal frontend base URL: ', baseUrl);

nunjucks.configure([
  'app/views',
  'node_modules/govuk-frontend/',
  'node_modules/govuk-frontend/components/'
], {
  autoescape: true,
  express: app
});

app.use(Express.accessLogger());

// Protect against some well known web vulnerabilities
// by setting HTTP headers appropriately.
app.use(helmet());

// Helmet content security policy (CSP) to allow only assets from same domain.
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ['\'self\''],
        fontSrc: ['\'self\' data:'],
        scriptSrc: [
            '\'self\'',
            '\'unsafe-inline\'',
            'www.google-analytics.com',
            'www.googletagmanager.com'
        ],
        connectSrc: ['\'self\'', 'www.gov.uk'],
        mediaSrc: ['\'self\''],
        frameSrc: ['\'none\''],
        imgSrc: [
            '\'self\'',
            'www.google-analytics.com',
            'www.googletagmanager.com'
        ]
    }
}));

const maxAge = config.get('ssl.hpkp.maxAge');
const sha256s = [
    config.get('ssl.hpkp.sha256s'),
    config.get('ssl.hpkp.sha256sBackup')
];

// Helmet HTTP public key pinning
app.use(helmet.hpkp({ maxAge, sha256s }));

// Helmet referrer policy
app.use(helmet.referrerPolicy({ policy: 'origin' }));

// Disallow search index indexing
app.use((req, res, next) => {
    // Setting headers stops pages being indexed even if indexed pages link to them.
    res.setHeader('X-Robots-Tag', 'noindex');
    res.setHeader('X-Served-By', os.hostname());
    res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
    next();
});

app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
});

app.use('/health', healthcheck.configure({
    checks: {},
    buildInfo: {
        name: "Immigration & Asylum appeal frontend"
    }
}));

app.use('/public', express.static(`${__dirname}/public`));
app.use('/', routes);

module.exports = app;
