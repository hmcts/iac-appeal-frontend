const express = require('express');
const paths = require('./paths');

/* eslint-disable new-cap */
const router = express.Router({});
/* eslint-enable new-cap */

router.use(paths.health, require('./middleware/system/health'));
router.use(paths.createAppealHomeOfficeDecision, require('./middleware/forms/create-appeal/home-office-decision'));
router.use(paths.createAppealBasicDetails, require('./middleware/forms/create-appeal/basic-details'));
router.use(paths.createAppealNationality, require('./middleware/forms/create-appeal/nationality'));
router.use(paths.createAppealAddress, require('./middleware/forms/create-appeal/address'));
router.use(paths.createAppealAppealReason, require('./middleware/forms/create-appeal/appeal-reason'));
router.use(paths.createAppealGroundsOfAppeal, require('./middleware/forms/create-appeal/grounds-of-appeal'));
router.use(paths.createAppealNewMatters, require('./middleware/forms/create-appeal/new-matters'));
router.use(paths.createAppealHasOtherAppeals, require('./middleware/forms/create-appeal/has-other-appeals'));
router.use(paths.createAppealOtherAppeals, require('./middleware/forms/create-appeal/other-appeals'));
router.use(paths.createAppealReferenceNumber, require('./middleware/forms/create-appeal/reference-number'));
router.use(paths.createAppealOutOfTime, require('./middleware/forms/create-appeal/out-of-time'));
router.use(paths.createAppealCheckAnswers, require('./middleware/forms/create-appeal/check-answers'));
router.use(paths.createAppeal, require('./middleware/forms/create-appeal/checklist'));
router.use(paths.groundsOfAppeal, require('./middleware/forms/grounds-of-appeal'));
router.use(paths.legalArgument, require('./middleware/forms/legal-argument'));
router.use(paths.submitCase, require('./middleware/forms/submit-case'));
router.use(paths.robots, require('./middleware/system/robots'));

module.exports = router;
