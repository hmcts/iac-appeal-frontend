const express = require('express');
const paths = require('./paths');

/* eslint-disable new-cap */
const router = express.Router({});
/* eslint-enable new-cap */

router.use(paths.health, require('./middleware/health'));
router.use(paths.helloWorld, require('./middleware/hello-world'));
router.use(paths.robots, require('./middleware/robots'));

module.exports = router;
