const config = require('config');

function redirectTo(req, res, path) {

  const url =
    req.protocol + '://' +
    req.hostname + ':' + config.get('node.port') +
    path;

  console.log("Redirecting to: " + url)
  res.writeHead(302, { 'Location': url });
  res.end();
};

module.exports = {
  redirectTo
};
