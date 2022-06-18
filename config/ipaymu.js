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
    const earlyBird = moment(date).isBetween('2022-05-09', '2022-05-29 24:00');
    const mainRegistration = moment(date).isBetween('2022-06-06', '2022-06-22 24:00');
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

    return {
      title: 'Registration closed!',
      price: 0,
    };
  },
};

//   EXAMPLE IPAYMU CALLBACK

//   0|playbox-be  | [Object: null prototype] {
//   0|playbox-be  |   trx_id: '8184314',
//   0|playbox-be  |   status: 'pending',
//   0|playbox-be  |   status_code: '0',
//   0|playbox-be  |   via: 'va',
//   0|playbox-be  |   channel: 'permata',
//   0|playbox-be  |   sid: '93ABA96C-761E-4B53-8B1D-E3F2CBDB66E2',
//   0|playbox-be  |   virtual_account: '727004000244918',
//   0|playbox-be  |   va: '727004000244918',
//   0|playbox-be  |   displayName: 'iPaymu PLAYBOX',
//   0|playbox-be  |   buyer_name: 'Farnest',
//   0|playbox-be  |   buyer_email: 'fauqi@farnest.xyz',
//   0|playbox-be  |   buyer_phone: '082151307040',
//   0|playbox-be  |   reference_id: '627b99a3b7985f26bcddb1c3',
//   0|playbox-be  |   total: '35000',
//   0|playbox-be  |   fee: '3500',
//   0|playbox-be  |   expired_at: '2022-05-12 21:56:03',
//   0|playbox-be  |   url: 'https://playbox.erpn.us/cb/notify/627b99a3b7985f26bcddb1c3'
//   0|playbox-be  | }
//   0|playbox-be  | POST /cb/notify/627b99a3b7985f26bcddb1c3 - - ms - -
//   0|playbox-be  | [Object: null prototype] {
//   0|playbox-be  |   trx_id: '8184314',
//   0|playbox-be  |   sid: '93ABA96C-761E-4B53-8B1D-E3F2CBDB66E2',
//   0|playbox-be  |   reference_id: '627b99a3b7985f26bcddb1c3',
//   0|playbox-be  |   status: 'berhasil',
//   0|playbox-be  |   status_code: '1',
//   0|playbox-be  |   via: 'va',
//   0|playbox-be  |   channel: 'permata',
//   0|playbox-be  |   va: '727004000244918',
//   0|playbox-be  |   buyer_name: 'Farnest',
//   0|playbox-be  |   buyer_email: 'fauqi@farnest.xyz',
//   0|playbox-be  |   buyer_phone: '082151307040',
//   0|playbox-be  |   total: '35000',
//   0|playbox-be  |   fee: '3500',
//   0|playbox-be  |   expired_at: '2022-05-12 21:56:03',
//   0|playbox-be  |   paid_at: '2022-05-12 20:59:04',
//   0|playbox-be  |   is_escrow: '0',
//   0|playbox-be  |   url: 'https://playbox.erpn.us/cb/notify/627b99a3b7985f26bcddb1c3'
//   0|playbox-be  | }
//   0|playbox-be  | POST /cb/notify/627b99a3b7985f26bcddb1c3 200 45.648 ms - 15
