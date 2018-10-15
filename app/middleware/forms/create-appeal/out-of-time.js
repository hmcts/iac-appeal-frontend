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
  req.session.createAppeal.outOfTime = req.session.createAppeal.outOfTime || {};

  let values = {
    backUrl: paths.createAppealReferenceNumber,
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    signOutUrl: juiLinkBuilder.buildLinkToSignOut(req),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  values.data = JSON.parse(JSON.stringify(req.session.createAppeal.outOfTime));
  values.data.outOfTime = values.data.outOfTime || [];

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

    values.data.explanation = post['explanation'];
    values.data.explanationDocument = exchangedDocuments['explanation-document'] || req.session.createAppeal.outOfTime.explanationDocument;

    // if (!values.data.explanation
    //   && !values.data.explanationDocument) {
    //
    //   values.errors.explanation = {
    //     text: 'You must tell us why you believe your late appeal should be allowed',
    //     href: "#explanation-fieldset"
    //   };
    //
    //   values.errorsSummary.push(values.errors.explanation);
    // }

    if (!Object.keys(values.errors).length) {

      req.session.createAppeal.outOfTime = values.data;

      return pathRedirector.redirectTo(req, res, paths.createAppealCheckAnswers);
    }

    values.data.previouslyExchangedDocumentsData = req.previouslyExchangedDocumentsData;
  }

  console.debug("=================");
  console.debug("VALUES:");
  console.debug(values);
  console.debug("=================");

  res.render(
    'forms/create-appeal/out-of-time.njk',
    values
  );
};
