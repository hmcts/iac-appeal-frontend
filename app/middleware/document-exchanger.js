const fs = require('fs');
const documentUploader = require('../services/api/documentUploader');

const exchangeableFileFieldNames = [
  'explanation-document',
  'legal-argument-document',
  'other-document',
  'supporting-evidence-document',
];

module.exports = async(req, res, next) => {

  try {

    // console.debug("=================");
    // console.debug("FILE DATA:");
    // console.debug(req.fileData);
    // console.debug("=================");

    if (Object.keys(req.fileData).length == 0) {
      return next();
    }

    if (!req.exchangedDocuments) {
      req.exchangedDocuments = {};
    }

    const fileFieldNames = Object.keys(req.fileData);
    for (let i = 0; i < fileFieldNames.length; i++) {
      const fileFieldName = fileFieldNames[i];
      const file = req.fileData[fileFieldName];

      if (exchangeableFileFieldNames.includes(fileFieldName)) {

        // @todo files uploaded here should have a shorter TTL, that is renewed when finally submitted
        // @todo perform validation like here:
        // https://github.com/hmcts/sscs-submit-your-appeal/blob/7082949fd1f2c401a6a322e1f81d38891e3fa5d7/steps/reasons-for-appealing/evidence-upload/EvidenceUpload.js#L71

        if (file.size > 0) {

          try {

            const fileStream = fs.createReadStream(file.path);

            const uploadedDocument = await
              documentUploader.upload(
                req.auth,
                req.params.caseId,
                file.name,
                fileStream
              );

            req.exchangedDocuments[fileFieldName] = uploadedDocument;

          } finally {
            delete req.fileData[fileFieldName];
            fs.unlink(file.path, x => {
            });
          }
        }
      }
    }

    if (req.method == 'POST'
      && req.postData.previouslyExchangedDocumentsData) {

      const previouslyExchangedDocuments =
        JSON.parse(
          Buffer
            .from(req.postData.previouslyExchangedDocumentsData, 'base64')
            .toString('ascii')
        );

      for (let i = 0; i < exchangeableFileFieldNames.length; i++) {
        const exchangeableFileFieldName = exchangeableFileFieldNames[i];

        if (!req.exchangedDocuments[exchangeableFileFieldName]
          && previouslyExchangedDocuments[exchangeableFileFieldName]) {
          req.exchangedDocuments[exchangeableFileFieldName] = previouslyExchangedDocuments[exchangeableFileFieldName];
        }
      }
    }

    req.previouslyExchangedDocumentsData =
      Buffer
        .from(JSON.stringify(req.exchangedDocuments))
        .toString('base64');

    return next();
  } catch (e) {
    return next(e);
  }
};
