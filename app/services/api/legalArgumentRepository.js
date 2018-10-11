const config = require('config');
const axios = require('axios');
const serviceTokenGenerator = require('../../services/auth/serviceTokenGenerator');
const iaCaseApiUrl = config.get('iaCaseApiUrl');

async function get(
  auth,
  caseId
) {
  try {

    const accessToken = auth.token;
    const serviceToken = await serviceTokenGenerator();
    const legalArgumentUrl = `${iaCaseApiUrl}/IA/Asylum/${caseId}/legal-argument`;

    const request = {
      method: 'GET',
      url: legalArgumentUrl,
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

async function post(
  auth,
  caseId,
  legalArgument
) {
  try {
    const accessToken = auth.token;
    const serviceToken = await serviceTokenGenerator();
    const legalArgumentUrl = `${iaCaseApiUrl}/IA/Asylum/${caseId}/legal-argument`;

    const request = {
      method: 'POST',
      url: legalArgumentUrl,
      headers: {
        'Authorization': accessToken,
        'ServiceAuthorization': serviceToken.token
      },
      json: true,
      data: legalArgument
    };

    console.log("request:");
    console.log(request);

    const response = await axios(request);
    console.log("response.data:");
    console.log(response.data);

  } catch (error) {
    console.log("response error:");
    console.error(error);
    return [];
  }
}

module.exports = {
  get,
  post
}
