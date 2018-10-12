const paths = require('../../../paths');
const pathRedirector = require('../../../services/pathRedirector');
const juiLinkBuilder = require('../../../services/juiLinkBuilder');

module.exports = async(req, res) => {

  console.log("Controller: " + __filename);

  let values = {
    appeal: {},
    backUrl: juiLinkBuilder.buildLinkToDashboard(req),
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
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

  if (req.method == 'POST') {

    return pathRedirector.redirectTo(req, res, paths.createAppealGroundsOfAppeal);
  }

  res.render(
    'forms/create-appeal/appeal-reason.njk',
    values
  );
};
