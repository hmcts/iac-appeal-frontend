
function buildLinkToDashboard(req) {

  const juiUrl =
    req.protocol + '://' +
    req.get('Host').replace('4000', '3000');

  return juiUrl;
};

function buildLinkToCase(req, caseId, tab) {

  const juiUrl =
    req.protocol + '://' +
    req.get('Host').replace('4000', '3000') +
    `/jurisdiction/IA/casetype/Asylum/viewcase/${caseId}/${tab}`;

  return juiUrl;
};

function buildLinkToSignOut(req) {

  const juiUrl =
    req.protocol + '://' +
    req.get('Host').replace('4000', '3000') +
    '/logout';

  return juiUrl;
};

module.exports = {
  buildLinkToDashboard,
  buildLinkToCase,
  buildLinkToSignOut
};
