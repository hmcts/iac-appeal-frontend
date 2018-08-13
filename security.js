const config = require('config');
const helmet = require('helmet');
const os = require('os');

function apply(app) {
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

  app.use(helmet.frameguard({ action: 'deny' }));
  app.use(helmet.referrerPolicy({ policy: 'origin' }));

  // Disallow search index indexing
  app.use((req, res, next) => {
    // Setting headers stops pages being indexed even if indexed pages link to them.
    res.setHeader('X-Robots-Tag', 'noindex');
    res.setHeader('X-Served-By', os.hostname());
    res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
    next();
  });
}

module.exports = { apply };
