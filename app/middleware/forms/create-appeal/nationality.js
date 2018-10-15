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
  req.session.createAppeal.nationality = req.session.createAppeal.nationality || {};

  let values = {
    backUrl: paths.createAppealBasicDetails,
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    signOutUrl: juiLinkBuilder.buildLinkToSignOut(req),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  values.data = JSON.parse(JSON.stringify(req.session.createAppeal.nationality));

  if (req.method == 'POST') {
    const post = req.postData || {};

    console.debug("=================");
    console.debug("POST:");
    console.debug(post);
    console.debug("=================");

    values.data.nationality = post['nationality'];
    values.data.nationalityContested = post['nationality-contested'];

    if (!values.data.nationality) {
      values.errors.nationality = {
        text: 'You must provide your client\'s nationality',
        href: "#nationality"
      };

      values.errorsSummary.push(values.errors.nationality);
    }

    if (!Object.keys(values.errors).length) {

      values.data.formattedNationalityContested =
        values.data.nationalityContested.replace(/./, values.data.nationalityContested.toUpperCase()[0]);

      req.session.createAppeal.nationality = values.data;

      return pathRedirector.redirectTo(req, res, paths.createAppealAddress);
    }
  }

  console.debug("=================");
  console.debug("VALUES:");
  console.debug(values);
  console.debug("=================");

  res.render(
    'forms/create-appeal/nationality.njk',
    values
  );
};
