const config = require('config');
const axios = require('axios');
const serviceTokenGenerator = require('../../services/auth/serviceTokenGenerator');
const iaCaseApiUrl = config.get('iaCaseApiUrl');

async function get(
  auth,
  caseId
) {
  const accessToken = auth.token;
  const serviceToken = await serviceTokenGenerator();
  const groundsUrl = `${iaCaseApiUrl}/IA/Asylum/${caseId}/grounds-of-appeal`;

  const request = {
    method: 'GET',
    url: groundsUrl,
    headers: {
      'Authorization': accessToken,
      'ServiceAuthorization': serviceToken.token
    },
    json: true,
    data: {}
  };

  console.log("request:");
  console.log(request);

  try {
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
  grounds
) {
  const accessToken = auth.token;
  const serviceToken = await serviceTokenGenerator();
  const groundsUrl = `${iaCaseApiUrl}/IA/Asylum/${caseId}/grounds-of-appeal`;

  const request = {
    method: 'POST',
    url: groundsUrl,
    headers: {
      'Authorization': accessToken,
      'ServiceAuthorization': serviceToken.token
    },
    json: true,
    data: grounds
  };

  console.log("request:");
  console.log(request);

  try {
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
