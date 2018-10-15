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
  req.session.createAppeal.otherAppeals = req.session.createAppeal.otherAppeals || {};

  let values = {
    backUrl: paths.createAppealHasOtherAppeals,
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    signOutUrl: juiLinkBuilder.buildLinkToSignOut(req),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  values.data = JSON.parse(JSON.stringify(req.session.createAppeal.otherAppeals));

  if (req.method == 'POST') {
    const post = req.postData || {};

    console.debug("=================");
    console.debug("POST:");
    console.debug(post);
    console.debug("=================");

    values.data.appealNumber = post['appeal-number'];

    if (!values.data.appealNumber) {
      values.errors.appealNumber = {
        text: 'You must tell us the previous appeal number',
        href: "#appeal-number"
      };

      values.errorsSummary.push(values.errors.appealNumber);
    }

    if (!Object.keys(values.errors).length) {

      req.session.createAppeal.otherAppeals = values.data;

      return pathRedirector.redirectTo(req, res, paths.createAppealReferenceNumber);
    }
  }

  console.debug("=================");
  console.debug("VALUES:");
  console.debug(values);
  console.debug("=================");

  res.render(
    'forms/create-appeal/other-appeals.njk',
    values
  );
};
