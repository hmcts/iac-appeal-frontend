const {INTERNAL_SERVER_ERROR} = require('http-status-codes');
const {Logger} = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('500-internal-server-error.js');

/* eslint-disable no-unused-vars */
module.exports = (error, req, res, next) => {
  logger.error(`500 Error from request ${req.originalUrl} : ${JSON.stringify(error)} : ${error}`);
  res.status(INTERNAL_SERVER_ERROR);
  res.render('errors/500-internal-server-error.html');
};
/* eslint-enable no-unused-vars */
