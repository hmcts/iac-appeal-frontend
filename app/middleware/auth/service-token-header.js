const serviceTokenGenerator = require('../../services/auth/serviceTokenGenerator');

module.exports = async(req, res, next) => {
  try {
    const serviceToken = await serviceTokenGenerator();
    req.headers['ServiceAuthorization'] = serviceToken.token;
  } catch (e) {
    console.log('Could not add S2S Service Token header');
  }

  next();
};
