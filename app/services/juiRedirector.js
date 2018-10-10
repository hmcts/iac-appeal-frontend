const juiLinkBuilder = require('../services/juiLinkBuilder');

module.exports = (req, res, caseId, tab) => {

  const redirectUrl = juiLinkBuilder(req, caseId, tab);

  console.log("Redirecting to: " + redirectUrl)
  res.writeHead(302, { 'Location': redirectUrl });
  res.end();
};
