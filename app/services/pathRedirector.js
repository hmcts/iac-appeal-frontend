
function redirectTo(req, res, path) {

  const url =
    req.protocol + '://' +
    req.get('Host') +
    path;

  console.log("Redirecting to: " + url)
  res.writeHead(302, { 'Location': url });
  res.end();
};

module.exports = {
  redirectTo
};
