const legalArgumentRepository = require('../../services/api/legalArgumentRepository');
const juiLinkBuilder = require('../../services/juiLinkBuilder');
const juiRedirector = require('../../services/juiRedirector');
const moment = require('moment');

function buildLegalArgumentFromPost(
  post,
  exchangedDocuments,
  storedLegalArgument
) {
  const legalArgument = {};

  if (exchangedDocuments['legal-argument-document']) {
    legalArgument.document = exchangedDocuments['legal-argument-document'];
  } else {
    legalArgument.document = storedLegalArgument.document;
  }

  if (post['legal-argument-description']) {
    legalArgument.description = post['legal-argument-description'];
  }

  if (exchangedDocuments['supporting-evidence-document']) {

    legalArgument.evidence = {
      documents: [
        {
          id: '0',
          value: {
            document: exchangedDocuments['supporting-evidence-document'],
            stored: "Yes",
            dateUploaded: moment().format('YYYY-MMD-D'),
            description: 'Legal argument supporting evidence.'
          }
        }
      ]
    }

  } else {
    legalArgument.evidence = storedLegalArgument.evidence;
  }

  return legalArgument;
}

module.exports = async(req, res) => {

  console.debug("Controller: " + __filename);

  const caseId = req.params.caseId;
  const juiTab = 'buildappeal';
  const storedCase = req.storedCase;

  let values = {
    caseId: caseId,
    appellantName: storedCase.caseDetails.appellantName,
    backUrl: juiLinkBuilder.buildLinkToCase(req, caseId, juiTab),
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    signOutUrl: juiLinkBuilder.buildLinkToSignOut(req),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  const storedLegalArgument =
    await legalArgumentRepository
      .get(req.auth, caseId)
      .catch(err => {
        console.error({
          status: err.response.status,
          body: err.response.body,
        });
        res.status(500)
        res.render('errors/500-internal-server-error.njk');
      });

  if (req.method == 'GET') {
    if (storedLegalArgument) {
      values.data.legalArgument = JSON.parse(JSON.stringify(storedLegalArgument));
    }
  }

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

    const legalArgument =
      buildLegalArgumentFromPost(
        post,
        exchangedDocuments,
        storedLegalArgument
      );

    if (!legalArgument.document) {
      values.errors.legalArgumentDocument = {
        text: 'An appeal argument is required',
        href: "#legal-argument-fieldset"
      };

      values.errorsSummary.push(values.errors.legalArgumentDocument);
    }

    if (!legalArgument.evidence) {
      values.errors.supportingEvidenceDocument = {
        text: 'Supporting evidence is required',
        href: "#supporting-evidence-fieldset"
      };

      values.errorsSummary.push(values.errors.supportingEvidenceDocument);
    }

    if (!Object.keys(values.errors).length) {

      await legalArgumentRepository
        .post(req.auth, caseId, legalArgument)
        .catch(err => {
          console.error({
            status: err.response.status,
            body: err.response.body,
          });
          res.status(500)
          res.render('errors/500-internal-server-error.njk');
        });

      juiRedirector.redirectToCase(req, res, caseId, juiTab);
      return;
    }

    values.data.legalArgument = legalArgument;
    values.data.previouslyExchangedDocumentsData = req.previouslyExchangedDocumentsData;
  }

  console.debug("=================");
  console.debug("VALUES:");
  console.debug(values);
  console.debug("=================");

  res.render(
    'forms/legal-argument.njk',
    values
  );
};
