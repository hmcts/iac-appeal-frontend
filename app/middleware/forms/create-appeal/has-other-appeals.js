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
  req.session.createAppeal.hasOtherAppeals = req.session.createAppeal.hasOtherAppeals || {};

  let values = {
    backUrl: paths.createAppealNewMatters,
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    signOutUrl: juiLinkBuilder.buildLinkToSignOut(req),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  values.data = JSON.parse(JSON.stringify(req.session.createAppeal.hasOtherAppeals));

  if (req.method == 'POST') {
    const post = req.postData || {};

    console.debug("=================");
    console.debug("POST:");
    console.debug(post);
    console.debug("=================");

    values.data.hasOtherAppeals = post['has-other-appeals'];

    if (!values.data.hasOtherAppeals) {
      values.errors.hasOtherAppeals = {
        text: 'You must tell us if you know of any other appeals',
        href: "#has-other-appeals-fieldset"
      };

      values.errorsSummary.push(values.errors.hasOtherAppeals);
    }

    if (!Object.keys(values.errors).length) {

      if (values.data.hasOtherAppeals == 'yes') {
        values.data.formattedHasOtherAppeals = 'Yes';
      }

      if (values.data.hasOtherAppeals == 'yesWithoutAppealNumber') {
        values.data.formattedHasOtherAppeals = 'Yes, but I don\'t have an appeal number';
      }

      if (values.data.hasOtherAppeals == 'no') {
        values.data.formattedHasOtherAppeals = 'No';
      }

      if (values.data.hasOtherAppeals == 'notSure') {
        values.data.formattedHasOtherAppeals = 'I\'m not sure';
      }

      req.session.createAppeal.hasOtherAppeals = values.data;

      if (values.data.hasOtherAppeals == 'yes') {
        return pathRedirector.redirectTo(req, res, paths.createAppealOtherAppeals);
      } else {
        delete req.session.createAppeal.otherAppeals;
        return pathRedirector.redirectTo(req, res, paths.createAppealReferenceNumber);
      }
    }
  }

  console.debug("=================");
  console.debug("VALUES:");
  console.debug(values);
  console.debug("=================");

  res.render(
    'forms/create-appeal/has-other-appeals.njk',
    values
  );
};
