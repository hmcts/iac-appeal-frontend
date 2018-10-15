const groundsOfAppealRepository = require('../../services/api/groundsOfAppealRepository');
const juiLinkBuilder = require('../../services/juiLinkBuilder');
const juiRedirector = require('../../services/juiRedirector');

module.exports = async(req, res) => {

  console.debug("Controller: " + __filename);

  const caseId = req.params.caseId;
  const juiTab = 'buildappeal';
  const storedCase = req.storedCase;

  let values = {
    caseId: caseId,
    appellantName: storedCase.caseDetails.appellantName,
    backUrl: juiLinkBuilder.buildLinkToCase(req, caseId, juiTab),
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    signOutUrl: juiLinkBuilder.buildLinkToSignOut(req),
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
      values.data.groundsOfAppeal.refugeeConvention = { checked: groundsOfAppeal.includes('refugeeConvention') };
      values.data.groundsOfAppeal.humanitarianProtection = { checked: groundsOfAppeal.includes('humanitarianProtection') }
      values.data.groundsOfAppeal.humanRightsConvention = { checked: groundsOfAppeal.includes('humanRightsConvention') };
    }
  }

  if (req.method == 'POST') {
    const post = req.postData || {};

    console.debug("=================");
    console.debug("POST:");
    console.debug(post);
    console.debug("=================");

    const groundsOfAppeal =
      Array.isArray(post['grounds-of-appeal']) ? post['grounds-of-appeal'] : post['grounds-of-appeal'] ? [post['grounds-of-appeal']] : [];

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

  console.debug("=================");
  console.debug("VALUES:");
  console.debug(values);
  console.debug("=================");

  res.render(
    'forms/grounds-of-appeal.njk',
    values
  );
};
