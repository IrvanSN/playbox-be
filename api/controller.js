const jwt = require('jsonwebtoken');
const multer = require('multer');
const CryptoJS = require('crypto-js');
const axios = require('axios');
const Team = require('../app/team/model');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${new Date().getTime()}.${
        file.originalname.split('.')[file.originalname.split('.').length - 1]
      }`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: fileStorage,
  limits: { fileSize: 1024 * 1024 * 2 },
  fileFilter,
}).fields([
  { name: 'memberOneIdImage' },
  { name: 'memberOneProfileImage' },
  { name: 'memberTwoIdImage' },
  { name: 'memberTwoProfileImage' },
  { name: 'memberThreeIdImage' },
  { name: 'memberThreeProfileImage' },
]);

module.exports = {
  signin: async (req, res) => {
    const { email, password } = req.body;
    const tokenExpires = 3 * 24 * 60 * 60;

    await Team.login(email, password)
      .then((r) => {
        const token = jwt.sign(
          {
            team: {
              id: r._id,
              email: r.email,
              phone: r.phone,
              category: r.category,
              status: r.status,
            },
          },
          process.env.JWT_KEY,
          { expiresIn: tokenExpires }
        );

        res.status(200).json({ error: false, data: { token } });
      })
      .catch((e) => {
        res.status(500).json({ error: true, message: e.message });
      });
  },
  getTeam: async (req, res) => {
    const { id } = req.team;

    await Team.findById(id)
      .then((r) => {
        res.status(200).json({ error: false, data: r });
      })
      .catch((e) => {
        res.status(500).json({ error: true, data: e.message });
      });
  },
  getTeamById: async (req, res) => {
    const { id } = req.params;

    await Team.findById(id)
      .then((r) => {
        res.status(200).json({ error: false, data: r });
      })
      .catch((e) => {
        res.status(500).json({ error: true, data: e.message });
      });
  },

  addTeam: async (req, res) => {
    const { name, email, phone, password } = req.body;

    await Team.create({
      name,
      email,
      phone,
      password,
    })
      .then((r) => res.status(200).json({ error: false, data: r }))
      .catch((e) => res.status(500).json({ error: true, message: e.message }));
  },
  updateBiodataTeam: (req, res) => {
    const { _id } = req.team;
    const URL = process.env.IMG_URL;

    upload(req, res, (err) => {
      const {
        category,
        memberOneName,
        memberOneInstitution,
        memberOnePhone,
        memberOneRole,
        memberOneEmail,
        memberTwoName,
        memberTwoInstitution,
        memberTwoPhone,
        memberTwoRole,
        memberTwoEmail,
        memberThreeName,
        memberThreeInstitution,
        memberThreePhone,
        memberThreeRole,
        memberThreeEmail,
      } = req.body;

      if (err instanceof multer.MulterError) {
        return res.status(500).json({
          error: true,
          message: err.message,
        });
      }

      if (err) {
        return res.status(500).json({
          error: true,
          message: err.message,
        });
      }

      const payload = {
        category,
        status: category === 'INT',
        member_one: {
          name: memberOneName,
          role: memberOneRole,
          email: memberOneEmail,
          institution: memberOneInstitution,
          phone: memberOnePhone,
          id_image: req.files.memberOneIdImage
            ? `${URL}/${req.files.memberOneIdImage[0].filename}`
            : req.team.member_one.id_image,
          profile_image: req.files.memberOneProfileImage
            ? `${URL}/${req.files.memberOneProfileImage[0].filename}`
            : req.team.member_one.profile_image,
        },
        member_two: {
          name: memberTwoName,
          role: memberTwoRole,
          email: memberTwoEmail,
          institution: memberTwoInstitution,
          phone: memberTwoPhone,
          id_image: req.files.memberTwoIdImage
            ? `${URL}/${req.files.memberTwoIdImage[0].filename}`
            : req.team.member_two.id_image,
          profile_image: req.files.memberTwoProfileImage
            ? `${URL}/${req.files.memberTwoProfileImage[0].filename}`
            : req.team.member_two.profile_image,
        },
        member_three: {
          name: memberThreeName,
          role: memberThreeRole,
          email: memberThreeEmail,
          institution: memberThreeInstitution,
          phone: memberThreePhone,
          id_image: req.files.memberThreeIdImage
            ? `${URL}/${req.files.memberThreeIdImage[0].filename}`
            : req.team.member_three.id_image,
          profile_image: req.files.memberProfileImage
            ? `${URL}/${req.files.memberProfileImage[0].filename}`
            : req.team.member_three.profile_image,
        },
      };

      Team.findByIdAndUpdate(_id, payload)
        .then(() =>
          res
            .status(200)
            .json({ error: false, message: 'Berhasil update biodata tim' })
        )
        .catch((e) =>
          res.status(500).json({ error: false, message: e.message })
        );
    });
  },
  updateIdeaTeam: async (req, res) => {
    const { _id } = req.team;
    const { idea } = req.body;

    Team.findByIdAndUpdate(_id, { idea })
      .then(() =>
        res
          .status(200)
          .json({ error: false, message: 'Berhasil update ide tim' })
      )
      .catch((e) => res.status(500).json({ error: true, message: e.message }));
  },
  teamPayment: async (req, res) => {
    const URL = `${process.env.API_URL_IPAYMU}/payment`;
    const { _id, email, phone, category, name, status } = req.team;

    if (status) {
      return res
        .status(500)
        .json({ error: true, message: 'Sudah melakukan pembayaran' });
    }

    if (category === '') {
      return res.status(500).json({
        error: true,
        message: 'Kategori masih kosong, silahkan update data anda!',
      });
    }

    const body = {
      account: process.env.VA_IPAYMU,
      product: [
        `Pendaftaran Playbox Season 3 Kategori ${
          category === 'MHS' ? 'Mahasiswa' : category === 'SMA' ? 'SMA/SMK' : ''
        }`,
      ],
      qty: ['1'],
      price: [category === 'MHS' ? 20000 : category === 'SMA' ? 15000 : ''],
      returnUrl: 'https://playbox.coderitts.tech/payment/success',
      cancelUrl: 'https://playbox.coderitts.tech/payment/failed',
      notifyUrl: process.env.NOTIFY_URL_IPAYMU,
      buyerName: name,
      buyerEmail: email,
      buyerPhone: phone,
      referenceId: _id,
      expired: 24,
    };

    console.log(body);

    const bodyStringify = JSON.stringify(body);
    const bodyEncrypt = CryptoJS.SHA256(bodyStringify);
    const stringToSign = `POST:${process.env.VA_IPAYMU}:${bodyEncrypt}:${process.env.API_KEY_IPAYMU}`;
    const signature = CryptoJS.enc.Hex.stringify(
      CryptoJS.HmacSHA256(stringToSign, process.env.API_KEY_IPAYMU)
    );

    axios({
      method: 'post',
      url: URL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        va: process.env.VA_IPAYMU,
        signature,
        timestamps: new Date().getTime(),
      },
      data: bodyStringify,
    })
      .then((r) => {
        const payload = {
          error: false,
          data: {
            url: r.data.Data.Url,
            sessionId: r.data.Data.SessionID,
          },
        };

        return res.status(200).json(payload);
      })
      .catch((e) => {
        const payload = {
          error: true,
          data: {
            status: e.response.data.Status,
            message: e.response.data.Message,
          },
        };

        return res.status(400).json(payload);
      });
  },
};
