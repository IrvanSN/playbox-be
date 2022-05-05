const CryptoJS = require('crypto-js');
const axios = require('axios');

module.exports = {
  callAPI: async (body, method, url) => {
    const bodyStringify = JSON.stringify(body);
    const bodyEncrypt = CryptoJS.SHA256(bodyStringify);
    const stringToSign = `${method}:${process.env.VA_IPAYMU}:${bodyEncrypt}:${process.env.API_KEY_IPAYMU}`;
    const signature = CryptoJS.enc.Hex.stringify(
      CryptoJS.HmacSHA256(stringToSign, process.env.API_KEY_IPAYMU),
    );

    return axios({
      method,
      url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        va: process.env.VA_IPAYMU,
        signature,
        timestamps: new Date().getTime(),
      },
      data: bodyStringify,
    }).then((r) => r.data).catch((e) => e.response.data);
  },
};
