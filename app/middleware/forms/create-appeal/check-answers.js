const paths = require('../../../paths');
const pathRedirector = require('../../../services/pathRedirector');
const juiLinkBuilder = require('../../../services/juiLinkBuilder');
const juiRedirector = require('../../../services/juiRedirector');

module.exports = async(req, res) => {

  console.log("Controller: " + __filename);

  let values = {
    appeal: {},
    backUrl: juiLinkBuilder.buildLinkToDashboard(req),
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    paths: paths,
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

  }

  res.render(
    'forms/create-appeal/check-answers.njk',
    values
  );
};
