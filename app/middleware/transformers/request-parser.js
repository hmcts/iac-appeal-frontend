const formidable = require('formidable');

module.exports = (req, res, next) => {

  if (!req.postData) {
    req.postData = {};
  }

  if (!req.fileData) {
    req.fileData = {};
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async function(error, fields, files) {
    try {
      req.postData = fields;
      req.fileData = files;
      return next();
    } catch (e) {
      return next(e);
    }
  });
};
