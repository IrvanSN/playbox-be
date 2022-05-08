const CryptoJS = require('crypto-js');
const axios = require('axios');
const moment = require('moment');

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
  generateProduct: (date, category) => {
    const earlyBird = moment(date).isBetween('2022-05-09', '2022-05-22');
    const mainRegistration = moment(date).isBetween('2022-06-06', '2022-06-18');
    const fee = 5000;

    if (earlyBird) {
      if (category === 'MHS') {
        return {
          title: 'Pendaftaran Playbox Season 3 Early Bird Kategori Mahasiswa',
          price: 60000 + fee,
        };
      }
      if (category === 'SMA') {
        return {
          title: 'Pendaftaran Playbox Season 3 Early Bird Kategori SMA/SMK',
          price: 30000 + fee,
        };
      }
    } else if (mainRegistration) {
      if (category === 'MHS') {
        return {
          title: 'Pendaftaran Playbox Season 3 Kategori Mahasiswa',
          price: 90000 + fee,
        };
      }
      if (category === 'SMA') {
        return {
          title: 'Pendaftaran Playbox Season 3 Kategori SMA/SMK',
          price: 60000 + fee,
        };
      }
    }
  },
};
