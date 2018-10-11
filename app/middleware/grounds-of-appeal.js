const groundsOfAppealRepository = require('../services/api/groundsOfAppealRepository');
const juiLinkBuilder = require('../services/juiLinkBuilder');
const juiRedirector = require('../services/juiRedirector');

module.exports = async(req, res) => {

  const caseId = req.params.caseId;
  const juiTab = 'buildappeal';

  let values = {
    groundsOfAppeal: {},
    backUrl: juiLinkBuilder(req, caseId, juiTab),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  // console.log("=================");
  // console.log(req.auth);
  // console.log("-----------------");
  // console.log(req.headers);
  // console.log("-----------------");
  // console.log(req.cookies);
  // console.log("-----------------");
  // console.log(req.params);
  // console.log("=================");

  if (req.method == 'GET') {

    const groundsOfAppeal = await
      groundsOfAppealRepository
        .get(req.auth, caseId)
        .catch(err => {
          console.error({
            status: err.response.status,
            body: err.response.body,
          });
          res.status(500)
          res.render('errors/500-internal-server-error.njk');
        });

    console.log("groundsOfAppeal:");
    console.log(groundsOfAppeal);

    if (groundsOfAppeal) {
      values.groundsOfAppeal.refugeeConventionChecked = groundsOfAppeal.includes('refugeeConvention');
      values.groundsOfAppeal.humanitarianProtectionChecked = groundsOfAppeal.includes('humanitarianProtection');
      values.groundsOfAppeal.humanRightsConventionChecked = groundsOfAppeal.includes('humanRightsConvention');
    }
  }

  if (req.method == 'POST') {
    const post = req.postData || {};

    console.debug("post:");
    console.debug(post);

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

    juiRedirector(req, res, caseId, juiTab);
    return;
  }

  res.render(
    'grounds-of-appeal.njk',
    values
  );
};
