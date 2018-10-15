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
  req.session.createAppeal.newMatters = req.session.createAppeal.newMatters || {};

  let values = {
    backUrl: paths.createAppealGroundsOfAppeal,
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    signOutUrl: juiLinkBuilder.buildLinkToSignOut(req),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  values.data = JSON.parse(JSON.stringify(req.session.createAppeal.newMatters));
  values.data.newMatters = values.data.newMatters || [];

  if (req.method == 'POST') {
    const exchangedDocuments = req.exchangedDocuments || {};
    const post = req.postData || {};

    console.debug("=================");
    console.debug("EXCHANGED DOCUMENTS:");
    console.debug(exchangedDocuments);
    console.debug("=================");

    console.debug("=================");
    console.debug("POST:");
    console.debug(post);
    console.debug("=================");

    let newMatters = [];
    Object.keys(post)
      .filter(key => key.startsWith('newMatters-'))
      .forEach(key => newMatters.push(post[key]));

    values.data.hasNewMatters = post['has-new-matters'];
    values.data.newMatters = newMatters;
    values.data.other = post['other'];
    values.data.otherDocument = exchangedDocuments['other-document'] || req.session.createAppeal.newMatters.otherDocument;

    if (!values.data.hasNewMatters) {
      values.errors.hasNewMatters = {
        text: 'You must tell us if your client has any new matters',
        href: "#has-new-matters"
      };

      values.errorsSummary.push(values.errors.hasNewMatters);
    }

    if (values.data.hasNewMatters == 'yes') {

      if (values.data.newMatters.length == 0) {
        values.errors.newMatters = {
          text: 'You must tell us about new matters',
          href: "#new-matters"
        };

        values.errorsSummary.push(values.errors.newMatters);
      }

      if (values.data.newMatters.includes('other')
        && !values.data.other
        && !values.data.otherDocument) {
        values.errors.other = {
          text: 'You must tell us about the other new matter',
          href: "#other-fieldset"
        };

        values.errorsSummary.push(values.errors.other);
      }
    }

    if (!Object.keys(values.errors).length) {

      values.data.formattedNewMatters =
        values.data.newMatters
          .map(newMatter => {
            if (newMatter == 'humanRightsNewChild') {
              return 'Birth of a child';
            }
            if (newMatter == 'humanRightsNewRelationship') {
              return 'New relationship';
            }
            if (newMatter == 'humanRightsBreachOfFamilyLife') {
              return 'Removal would disrupt family life';
            }
            if (newMatter == 'humanRightsRefugee') {
              return 'Appellant now claims to be a refugee';
            }
            if (newMatter == 'humanRightsMarriedBritishCitizen') {
              return 'New marriage';
            }
            if (newMatter == 'other') {
              return 'Other';
            }
          });

      req.session.createAppeal.newMatters = values.data;

      return pathRedirector.redirectTo(req, res, paths.createAppealHasOtherAppeals);
    }

    values.data.previouslyExchangedDocumentsData = req.previouslyExchangedDocumentsData;
  }

  console.debug("=================");
  console.debug("VALUES:");
  console.debug(values);
  console.debug("=================");

  res.render(
    'forms/create-appeal/new-matters.njk',
    values
  );
};
