const express = require('express');
const paths = require('paths');

/* eslint-disable new-cap */
const router = express.Router();
/* eslint-enable new-cap */

router.use(paths.health, require('app/middleware/health'));
router.use(paths.helloWorld, require('app/middleware/hello-world'));
router.use(paths.robots, require('app/middleware/robots'));

module.exports = router;
