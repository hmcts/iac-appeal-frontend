const caseRepository = require('../services/api/caseRepository');

module.exports = async(req, res, next) => {

  try {

    if (req.params.caseId) {
      req.storedCase = await caseRepository.get(req.auth, req.params.caseId);
    }

    return next();
  } catch (e) {
    return next(e);
  }
};
