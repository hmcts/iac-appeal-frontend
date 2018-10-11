const config = require('config');
const axios = require('axios');
const FormData = require('form-data');
const serviceTokenGenerator = require('../../services/auth/serviceTokenGenerator');
const iaCaseApiUrl = config.get('iaCaseApiUrl');

async function upload(
  auth,
  caseId,
  fileName,
  fileStream
) {
  try {

    const accessToken = auth.token;
    const serviceToken = await serviceTokenGenerator();
    const uploadDocumentUrl = `${iaCaseApiUrl}/IA/Asylum/${caseId}/upload-document`;

    const formData = new FormData();
    formData.append('file', fileStream, fileName);

    const request = {
      method: 'POST',
      url: uploadDocumentUrl,
      headers: {
        'Authorization': accessToken,
        'ServiceAuthorization': serviceToken.token,
        'Content-Type': formData.getHeaders()['content-type']
      },
      data: formData
    };

    console.log("request:");
    console.log(request);

    const response = await axios(request);
    console.log("response.data:");
    console.log(response.data);
    return response.data;

  } catch (error) {
    console.log("response error:");
    console.error(error);
    return [];
  }
}

module.exports = {
  upload
}
