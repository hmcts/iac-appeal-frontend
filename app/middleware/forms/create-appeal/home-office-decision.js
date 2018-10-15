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
  req.session.createAppeal.homeOfficeDecision = req.session.createAppeal.homeOfficeDecision || {};

  let values = {
    backUrl: paths.createAppeal,
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    signOutUrl: juiLinkBuilder.buildLinkToSignOut(req),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  values.data = JSON.parse(JSON.stringify(req.session.createAppeal.homeOfficeDecision));

  if (req.method == 'POST') {
    const post = req.postData || {};

    console.debug("=================");
    console.debug("POST:");
    console.debug(post);
    console.debug("=================");

    values.data.referenceNumber = post['reference-number'];
    values.data.decisionDateDay = post['decision-date-day'];
    values.data.decisionDateMonth = post['decision-date-month'];
    values.data.decisionDateYear = post['decision-date-year'];

    if (!values.data.referenceNumber) {
      values.errors.referenceNumber = {
        text: 'You must provide the Home Office reference number',
        href: "#reference-number"
      };

      values.errorsSummary.push(values.errors.referenceNumber);
    }

    if (!values.data.decisionDateDay
      || !values.data.decisionDateMonth
      || !values.data.decisionDateYear) {
      values.errors.decisionDate = {
        text: 'You must provide the Home Office decision date',
        href: "#decision-date"
      };

      values.errorsSummary.push(values.errors.decisionDate);
    }

    if (values.data.decisionDateDay != '') {
      values.data.decisionDateDay = values.data.decisionDateDay.padStart(2, '0');
    }

    if (values.data.decisionDateMonth != '') {
      values.data.decisionDateMonth = values.data.decisionDateMonth.padStart(2, '0');
    }

    if (!Object.keys(values.errors).length) {

      values.data.decisionDate = (
        values.data.decisionDateYear + '-' +
        values.data.decisionDateMonth + '-' +
        values.data.decisionDateDay
      );

      req.session.createAppeal.homeOfficeDecision = values.data;

      return pathRedirector.redirectTo(req, res, paths.createAppealBasicDetails);
    }
  }

  console.debug("=================");
  console.debug("VALUES:");
  console.debug(values);
  console.debug("=================");

  res.render(
    'forms/create-appeal/home-office-decision.njk',
    values
  );
};
