const { Logger } = require('@hmcts/nodejs-logging');
const app = require('./app');
const config = require('config');

const logger = Logger.getLogger('server.js');
const port = config.get('node.port');

app.create().listen(port);

logger.info(`Server listening on port: ${port}`);
