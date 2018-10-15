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
  req.session.createAppeal.checklist = req.session.createAppeal.checklist || [];

  let values = {
    backUrl: juiLinkBuilder.buildLinkToDashboard(req),
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    signOutUrl: juiLinkBuilder.buildLinkToSignOut(req),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  values.data.checklist = JSON.parse(JSON.stringify(req.session.createAppeal.checklist));

  if (req.method == 'POST') {
    const post = req.postData || {};

    console.debug("=================");
    console.debug("POST:");
    console.debug(post);
    console.debug("=================");

    let checklist = [];
    if (post['checklist']) {
      checklist = checklist.concat(post['checklist']);
    }

    values.data.checklist = checklist;

    if (values.data.checklist.length != 5) {
      values.errors.checklist = {
        text: 'Your client is not eligible to use this beta service',
        href: "#checklist"
      };

      values.errorsSummary.push(values.errors.checklist);
    }

    if (!Object.keys(values.errors).length) {

      req.session.createAppeal.checklist = values.data.checklist;

      return pathRedirector.redirectTo(req, res, paths.createAppealHomeOfficeDecision);
    }
  }

  console.debug("=================");
  console.debug("VALUES:");
  console.debug(values);
  console.debug("=================");

  res.render(
    'forms/create-appeal/checklist.njk',
    values
  );
};
