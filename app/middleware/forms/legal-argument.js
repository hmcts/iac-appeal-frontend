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

  legalArgument.evidence = {
    documents: [
      {
        id: '0',
        value: {}
      }
    ]
  }

  if (exchangedDocuments['supporting-evidence-document']) {
    legalArgument.evidence.documents[0].value.document = exchangedDocuments['supporting-evidence-document'];
    legalArgument.evidence.documents[0].value.stored = "Yes";
    legalArgument.evidence.documents[0].value.dateUploaded = moment().format('YYYY-MMD-D');
  } else {
    if (storedLegalArgument.evidence && storedLegalArgument.evidence.documents.documents.length > 0) {
      legalArgument.evidence.documents[0].value.document = storedLegalArgument.evidence.documents[0].value.document;
      legalArgument.evidence.documents[0].value.stored = storedLegalArgument.evidence.documents[0].value.stored;
      legalArgument.evidence.documents[0].value.dateUploaded = storedLegalArgument.evidence.documents[0].value.dateUploaded;
    }
  }

  if (post['supporting-evidence-description']) {
    legalArgument.evidence.documents[0].value.description = post['supporting-evidence-description'];
  }

  if (!legalArgument.evidence.documents[0].value) {
    delete legalArgument.evidence
  }

  return legalArgument;
}

module.exports = async(req, res) => {

  const caseId = req.params.caseId;
  const juiTab = 'buildappeal';
  const storedCase = req.storedCase;

  let values = {
    caseId: caseId,
    appellantName: storedCase.caseDetails.appellantName,
    legalArgument: {},
    backUrl: juiLinkBuilder.buildLinkToCase(req, caseId, juiTab),
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
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
      values.legalArgument = storedLegalArgument;
    }
  }

  if (req.method == 'POST') {
    const post = req.postData || {};
    const exchangedDocuments = req.exchangedDocuments || {};

    const legalArgument =
      buildLegalArgumentFromPost(
        post,
        exchangedDocuments,
        storedLegalArgument
      );

    if (!legalArgument.document) {
      values.errors.legalArgumentDocument = {
        text: 'An appeal argument is required',
        href: "#legal-argument-document"
      };

      values.errorsSummary.push(values.errors.legalArgumentDocument);
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

    values.legalArgument = legalArgument;
    values.previouslyExchangedDocumentsData = req.previouslyExchangedDocumentsData;
  }

  res.render(
    'forms/legal-argument.njk',
    values
  );
};
