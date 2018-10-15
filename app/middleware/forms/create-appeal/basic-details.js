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
  req.session.createAppeal.basicDetails = req.session.createAppeal.basicDetails || {};

  let values = {
    backUrl: paths.createAppealHomeOfficeDecision,
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    signOutUrl: juiLinkBuilder.buildLinkToSignOut(req),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  values.data = JSON.parse(JSON.stringify(req.session.createAppeal.basicDetails));

  if (req.method == 'POST') {
    const post = req.postData || {};

    console.debug("=================");
    console.debug("POST:");
    console.debug(post);
    console.debug("=================");

    values.data.title = post['title'];
    values.data.givenNames = post['given-names'];
    values.data.lastName = post['last-name'];
    values.data.dateOfBirthDay = post['date-of-birth-day'];
    values.data.dateOfBirthMonth = post['date-of-birth-month'];
    values.data.dateOfBirthYear = post['date-of-birth-year'];

    if (!values.data.title) {
      values.errors.title = {
        text: 'You must provide your client\'s title',
        href: "#title"
      };

      values.errorsSummary.push(values.errors.title);
    }

    if (!values.data.givenNames) {
      values.errors.givenNames = {
        text: 'You must provide your client\'s given names',
        href: "#given-names"
      };

      values.errorsSummary.push(values.errors.givenNames);
    }

    if (!values.data.lastName) {
      values.errors.lastName = {
        text: 'You must provide your client\'s last name',
        href: "#last-name"
      };

      values.errorsSummary.push(values.errors.lastName);
    }

    if (!values.data.dateOfBirthDay
      || !values.data.dateOfBirthMonth
      || !values.data.dateOfBirthYear) {
      values.errors.dateOfBirth = {
        text: 'You must provide your client\'s date of birth',
        href: "#date-of-birth"
      };

      values.errorsSummary.push(values.errors.dateOfBirth);
    }

    if (values.data.dateOfBirthDay != '') {
      values.data.dateOfBirthDay = values.data.dateOfBirthDay.padStart(2, '0');
    }

    if (values.data.dateOfBirthMonth != '') {
      values.data.dateOfBirthMonth = values.data.dateOfBirthMonth.padStart(2, '0');
    }

    if (!Object.keys(values.errors).length) {

      values.data.dateOfBirth = (
        values.data.dateOfBirthYear + '-' +
        values.data.dateOfBirthMonth + '-' +
        values.data.dateOfBirthDay
      );

      req.session.createAppeal.basicDetails = values.data;

      return pathRedirector.redirectTo(req, res, paths.createAppealNationality);
    }
  }

  console.debug("=================");
  console.debug("VALUES:");
  console.debug(values);
  console.debug("=================");

  res.render(
    'forms/create-appeal/basic-details.njk',
    values
  );
};
