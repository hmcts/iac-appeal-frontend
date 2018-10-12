module.exports = (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /');
};
