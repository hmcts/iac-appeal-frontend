const express = require('express');
const paths = require('./paths');

/* eslint-disable new-cap */
const router = express.Router({});
/* eslint-enable new-cap */

router.use(paths.health, require('./middleware/system/health'));
router.use(paths.createAppeal, require('./middleware/forms/create-appeal'));
router.use(paths.groundsOfAppeal, require('./middleware/forms/grounds-of-appeal'));
router.use(paths.legalArgument, require('./middleware/forms/legal-argument'));
router.use(paths.robots, require('./middleware/system/robots'));

module.exports = router;
