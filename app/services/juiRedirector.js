const juiLinkBuilder = require('../services/juiLinkBuilder');

function redirectToDashboard(req, res) {

  const redirectUrl = juiLinkBuilder.buildLinkToDashboard(req);

  console.log("Redirecting to: " + redirectUrl)
  res.writeHead(302, { 'Location': redirectUrl });
  res.end();
};

function redirectToCase(req, res, caseId, tab) {

  const redirectUrl = juiLinkBuilder.buildLinkToCase(req, caseId, tab);

  console.log("Redirecting to: " + redirectUrl)
  res.writeHead(302, { 'Location': redirectUrl });
  res.end();
};

module.exports = {
  redirectToDashboard,
  redirectToCase
};
