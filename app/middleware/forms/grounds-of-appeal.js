const groundsOfAppealRepository = require('../../services/api/groundsOfAppealRepository');
const juiLinkBuilder = require('../../services/juiLinkBuilder');
const juiRedirector = require('../../services/juiRedirector');

module.exports = async(req, res) => {

  const caseId = req.params.caseId;
  const juiTab = 'buildappeal';
  const storedCase = req.storedCase;

  let values = {
    caseId: caseId,
    appellantName: storedCase.caseDetails.appellantName,
    groundsOfAppeal: {},
    backUrl: juiLinkBuilder.buildLinkToCase(req, caseId, juiTab),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  if (req.method == 'GET') {

    const groundsOfAppeal =
      await groundsOfAppealRepository
        .get(req.auth, caseId)
        .catch(err => {
          console.error({
            status: err.response.status,
            body: err.response.body,
          });
          res.status(500)
          res.render('errors/500-internal-server-error.njk');
        });

    if (groundsOfAppeal) {
      values.groundsOfAppeal.refugeeConventionChecked = groundsOfAppeal.includes('refugeeConvention');
      values.groundsOfAppeal.humanitarianProtectionChecked = groundsOfAppeal.includes('humanitarianProtection');
      values.groundsOfAppeal.humanRightsConventionChecked = groundsOfAppeal.includes('humanRightsConvention');
    }
  }

  if (req.method == 'POST') {
    const post = req.postData || {};

    const groundsOfAppeal = Array.isArray(post.groundsOfAppeal) ? post.groundsOfAppeal : post.groundsOfAppeal ? [post.groundsOfAppeal] : [];

    await groundsOfAppealRepository
      .post(req.auth, caseId, groundsOfAppeal)
      .catch(err => {
        console.error({
          status: err.response.status,
          body: err.response.body,
        });
        res.status(500)
        res.render('errors/500-internal-server-error.njk');
      });

    juiRedirector.redirectToCase(req, res, caseId, juiTab);
    return;
  }

  res.render(
    'forms/grounds-of-appeal.njk',
    values
  );
};
