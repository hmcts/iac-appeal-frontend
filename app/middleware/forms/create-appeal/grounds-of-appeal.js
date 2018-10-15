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
  req.session.createAppeal.groundsOfAppeal = req.session.createAppeal.groundsOfAppeal || {};

  let values = {
    backUrl: paths.createAppealAppealReason,
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    signOutUrl: juiLinkBuilder.buildLinkToSignOut(req),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  values.data = JSON.parse(JSON.stringify(req.session.createAppeal.groundsOfAppeal));
  values.data.groundsOfAppeal = values.data.groundsOfAppeal || [];

  if (req.method == 'POST') {
    const post = req.postData || {};

    console.debug("=================");
    console.debug("POST:");
    console.debug(post);
    console.debug("=================");

    let groundsOfAppeal = [];
    if (post['grounds-of-appeal']) {
      groundsOfAppeal = groundsOfAppeal.concat(post['grounds-of-appeal']);
    }

    values.data.groundsOfAppeal = groundsOfAppeal;

    if (!Object.keys(values.errors).length) {

      values.data.formattedGroundsOfAppeal =
        values.data.groundsOfAppeal
          .map(groundOfAppeal => {
            if (groundOfAppeal == 'refugeeConvention') {
              return 'Removing the appellant from the UK would breach the UK\'s obligations under the Refugee Convention';
            }
            if (groundOfAppeal == 'humanitarianProtection') {
              return 'Removing the appellant from the UK would breach the UK\'s obligations in relation to persons eligible for a grant of humanitarian protection';
            }
            if (groundOfAppeal == 'humanRightsConvention') {
              return 'Removing the appellant from the UK would be unlawful under section 6 of the Human Rights Act 1998 (public authority not to act contrary to Human Rights Convention)';
            }
          });

      req.session.createAppeal.groundsOfAppeal = values.data;

      return pathRedirector.redirectTo(req, res, paths.createAppealNewMatters);
    }
  }

  console.debug("=================");
  console.debug("VALUES:");
  console.debug(values);
  console.debug("=================");

  res.render(
    'forms/create-appeal/grounds-of-appeal.njk',
    values
  );
};
