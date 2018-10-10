const config = require('config');
const otp = require('otp');
const jwtDecode = require('jwt-decode');
const request = require('request-promise');

const microservice = config.get('microservice');
const s2sEndpoint = config.get('auth.s2sEndpoint');
const secret = process.env.IAFR_S2S_SECRET || 'AAAAAAAAAAAAAAAA';
const _cache = {};

function validateCache() {
  const currentTime = Math.floor(Date.now() / 1000);
  if (!_cache[microservice]) return false;
  return currentTime < _cache[microservice].expiresAt;
}

function getToken() {
  return _cache[microservice];
}

function generateToken() {
  const oneTimePassword = otp({ secret }).totp();

  let options = {
    url: `${s2sEndpoint}/lease`,
    method: 'POST',
    body: {
      oneTimePassword,
      microservice
    },
    json: true
  };

  return new Promise((resolve, reject) => {
    request(options).then(body => {
      const tokenData = jwtDecode(body);
      _cache[microservice] = {
        expiresAt: tokenData.exp,
        token: body
      };
      resolve();
    })
      .catch(e => {
        console.log('Error creating S2S token! S2S service error - ', e.message);
        reject();
      });
  });
}


function serviceTokenGenerator() {
  return new Promise((resolve, reject) => {
    if (validateCache()) {
      resolve(getToken());
    } else {
      generateToken().then(() => {
        resolve(getToken());
      })
        .catch(e => {
          console.log('Failed to get S2S token');
          reject();
        });
    }
  });
}

module.exports = serviceTokenGenerator;
