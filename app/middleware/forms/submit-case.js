const caseSubmitter = require('../../services/api/caseSubmitter');
const juiRedirector = require('../../services/juiRedirector');

module.exports = async(req, res) => {

  const caseId = req.params.caseId;
  const juiTab = 'buildappeal';

  await caseSubmitter.submit(req.auth, caseId);

  juiRedirector.redirectToCase(req, res, caseId, juiTab);
  return;
};
