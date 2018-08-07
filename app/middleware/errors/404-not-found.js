const { NOT_FOUND } = require('http-status-codes');

module.exports = (req, res) => {
  res.status(NOT_FOUND);
  res.render('errors/404-not-found.html');
};
