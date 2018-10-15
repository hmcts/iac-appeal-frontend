const paths = require('../../../paths');
const pathRedirector = require('../../../services/pathRedirector');
const juiLinkBuilder = require('../../../services/juiLinkBuilder');

module.exports = async(req, res) => {

  console.debug("Controller: " + __filename);

  console.debug("=================");
  console.debug("SESSION:");
  console.debug(req.session);
  console.debug("=================");

  req.session.createAppeal = req.session.createAppeal || {};
  req.session.createAppeal.referenceNumber = req.session.createAppeal.referenceNumber || '';

  let backUrl;
  if (req.session.createAppeal.hasOtherAppeals == 'yes') {
    backUrl = paths.createAppealOtherAppeals;
  } else {
    backUrl = paths.createAppealHasOtherAppeals;
  }

  let values = {
    backUrl: backUrl,
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    signOutUrl: juiLinkBuilder.buildLinkToSignOut(req),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  values.data.referenceNumber = JSON.parse(JSON.stringify(req.session.createAppeal.referenceNumber));

  if (req.method == 'POST') {
    const post = req.postData || {};

    console.debug("=================");
    console.debug("POST:");
    console.debug(post);
    console.debug("=================");

    values.data.referenceNumber = post['reference-number'];

    if (!Object.keys(values.errors).length) {

      req.session.createAppeal.referenceNumber = values.data.referenceNumber;

      return pathRedirector.redirectTo(req, res, paths.createAppealOutOfTime);
    }
  }

  console.debug("=================");
  console.debug("VALUES:");
  console.debug(values);
  console.debug("=================");

  res.render(
    'forms/create-appeal/reference-number.njk',
    values
  );
};
