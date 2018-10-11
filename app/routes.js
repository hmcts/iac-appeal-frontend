const express = require('express');
const paths = require('./paths');

/* eslint-disable new-cap */
const router = express.Router({});
/* eslint-enable new-cap */

router.use(paths.health, require('./middleware/health'));
router.use(paths.groundsOfAppeal, require('./middleware/grounds-of-appeal'));
router.use(paths.legalArgument, require('./middleware/legal-argument'));
router.use(paths.robots, require('./middleware/robots'));

module.exports = router;
