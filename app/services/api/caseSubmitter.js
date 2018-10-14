const config = require('config');
const axios = require('axios');
const serviceTokenGenerator = require('../../services/auth/serviceTokenGenerator');
const iaCaseApiUrl = config.get('iaCaseApiUrl');

async function submit(
  auth,
  caseId
) {
  try {
    const accessToken = auth.token;
    const serviceToken = await serviceTokenGenerator();
    const caseUrl = `${iaCaseApiUrl}/IA/Asylum/${caseId}/submit-case`;

    const request = {
      method: 'POST',
      url: caseUrl,
      headers: {
        'Authorization': accessToken,
        'ServiceAuthorization': serviceToken.token
      },
      json: true,
      data: {}
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
  submit
}
