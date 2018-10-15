const paths = require('../../../paths');
const pathRedirector = require('../../../services/pathRedirector');
const juiLinkBuilder = require('../../../services/juiLinkBuilder');
const juiRedirector = require('../../../services/juiRedirector');

module.exports = async(req, res) => {

  console.debug("Controller: " + __filename);

  console.debug("=================");
  console.debug("SESSION:");
  console.debug(req.session);
  console.debug("=================");

  req.session.createAppeal = req.session.createAppeal || {};

  let values = {
    backUrl: paths.createAppealOutOfTime,
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    signOutUrl: juiLinkBuilder.buildLinkToSignOut(req),
    paths: paths,
    data: {},
    errors: {},
    errorsSummary: [],
  };

  values.data = {
    homeOfficeDecision: req.session.createAppeal.homeOfficeDecision || {},
    basicDetails: req.session.createAppeal.basicDetails || {},
    nationality: req.session.createAppeal.nationality || {},
    address: req.session.createAppeal.address || {},
    appealReason: req.session.createAppeal.appealReason || '',
    groundsOfAppeal: req.session.createAppeal.groundsOfAppeal || [],
    newMatters: req.session.createAppeal.newMatters || {},
    hasOtherAppeals: req.session.createAppeal.hasOtherAppeals || '',
    otherAppeals: req.session.createAppeal.otherAppeals || {},
    referenceNumber: req.session.createAppeal.referenceNumber || '',
    outOfTime: req.session.createAppeal.outOfTime || {}
  };

  if (req.method == 'POST') {
    const post = req.postData || {};

    console.debug("=================");
    console.debug("POST:");
    console.debug(post);
    console.debug("=================");

  }

  console.debug("=================");
  console.debug("VALUES:");
  console.debug(values);
  console.debug("=================");

  res.render(
    'forms/create-appeal/check-answers.njk',
    values
  );
};
