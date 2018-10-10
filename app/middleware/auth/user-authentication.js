const config = require('config');
const jwtDecode = require('jwt-decode');

const accessTokenCookieName = config.get('cookieNames.accessToken');
const userIdCookieName = config.get('cookieNames.userId');

module.exports = (req, res, next) => {
  const userId = req.headers[userIdCookieName] || req.cookies[userIdCookieName];
  const jwt = req.headers.authorization || req.cookies[accessTokenCookieName];
  const jwtData = jwtDecode(jwt);
  const expires = new Date(jwtData.exp).getTime();
  const now = new Date().getTime() / 1000;
  const expired = expires < now;

  if (expired) {
    res.status(401).send('Access Token has expired');
    // @todo: redirect to IDAM

  } else {
    req.auth = jwtData;
    req.auth.token = jwt;
    req.auth.userId = userId;
    next();
  }
};
