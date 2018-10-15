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
  req.session.createAppeal.address = req.session.createAppeal.address || {};

  let values = {
    backUrl: paths.createAppealNationality,
    dashBoardUrl: juiLinkBuilder.buildLinkToDashboard(req),
    signOutUrl: juiLinkBuilder.buildLinkToSignOut(req),
    data: {},
    errors: {},
    errorsSummary: [],
  };

  values.data = JSON.parse(JSON.stringify(req.session.createAppeal.address));

  if (req.method == 'POST') {
    const post = req.postData || {};

    console.debug("=================");
    console.debug("POST:");
    console.debug(post);
    console.debug("=================");

    values.data.hasFixedAddress = post['has-fixed-address'];
    values.data.line1 = post['line-1'];
    values.data.line2 = post['line-2'];
    values.data.townOrCity = post['town-or-city'];
    values.data.county = post['county'];
    values.data.postcode = post['postcode'];
    values.data.country = post['country'];

    if (!values.data.hasFixedAddress) {
      values.errors.hasFixedAddress = {
        text: 'You must tell us if your client has a fixed address',
        href: "#has-fixed-address"
      };

      values.errorsSummary.push(values.errors.hasFixedAddress);
    }

    if (values.data.hasFixedAddress == 'yes') {

      if (!values.data.line1) {
        values.errors.line1 = {
          text: 'You must provide the first line of your client\'s fixed address',
          href: "#line-1"
        };

        values.errorsSummary.push(values.errors.line1);
      }

      if (!values.data.townOrCity) {
        values.errors.townOrCity = {
          text: 'You must provide the town or city from your client\'s fixed address',
          href: "#town-or-city"
        };

        values.errorsSummary.push(values.errors.townOrCity);
      }

      if (!values.data.postcode) {
        values.errors.postcode = {
          text: 'You must provide the postcode from your client\'s fixed address',
          href: "#postcode"
        };

        values.errorsSummary.push(values.errors.postcode);
      }

      if (!values.data.country) {
        values.errors.country = {
          text: 'You must provide the country from your client\'s fixed address',
          href: "#country"
        };

        values.errorsSummary.push(values.errors.country);
      }
    }

    if (!Object.keys(values.errors).length) {

      values.data.formattedHasFixedAddress =
        values.data.hasFixedAddress.replace(/./, values.data.hasFixedAddress.toUpperCase()[0]);

      values.data.formattedAddress = (
        values.data.line1 + "\n" +
        values.data.line2 + "\n" +
        values.data.townOrCity + "\n" +
        values.data.county + "\n" +
        values.data.postcode + "\n" +
        values.data.country
      );

      values.data.formattedAddress =
        values.data.formattedAddress.replace(/\n+/g, "\n").trim();

      req.session.createAppeal.address = values.data;

      return pathRedirector.redirectTo(req, res, paths.createAppealAppealReason);
    }
  }

  console.debug("=================");
  console.debug("VALUES:");
  console.debug(values);
  console.debug("=================");

  res.render(
    'forms/create-appeal/address.njk',
    values
  );
};
