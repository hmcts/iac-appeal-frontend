const juiLinkBuilder = require('../../services/juiLinkBuilder');
const juiRedirector = require('../../services/juiRedirector');

module.exports = async(req, res) => {

  const caseId = req.params.caseId;
  const storedCase = req.storedCase;

  let values = {
    caseId: caseId,
    appellantName: storedCase.caseDetails.appellantName,
    appeal: {},
    backUrl: juiLinkBuilder.buildLinkToDashboard(req),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  // console.log("=================");
  // console.log(req.auth);
  // console.log("-----------------");
  // console.log(req.headers);
  // console.log("-----------------");
  // console.log(req.cookies);
  // console.log("-----------------");
  // console.log(req.params);
  // console.log("=================");

  res.render(
    'forms/create-appeal/checklist.njk',
    values
  );
};
