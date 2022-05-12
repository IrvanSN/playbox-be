const jwt = require('jsonwebtoken');
const multer = require('multer');
const moment = require('moment');
const axios = require('axios');
const Team = require('../app/team/model');
const { callAPI, generateProduct } = require('../config/ipaymu');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${new Date().getTime()}.${
        file.originalname.split('.')[file.originalname.split('.').length - 1]
      }`,
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png'
    || file.mimetype === 'image/jpg'
    || file.mimetype === 'image/jpeg'
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
              paymentStatus: r.payment.status,
            },
          },
          process.env.JWT_KEY,
          { expiresIn: '24h' },
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
        const product = generateProduct(moment().add(1, 'd').format(), r.category);

        res.status(200).json({ error: false, data: r, product });
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
    const {
      name, email, phone, password,
    } = req.body;

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

    upload(req, res, async (err) => {
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
          profile_image: req.files.memberThreeProfileImage
            ? `${URL}/${req.files.memberThreeProfileImage[0].filename}`
            : req.team.member_three.profile_image,
        },
      };

      if (
        payload.member_one.id_image
        && payload.member_two.id_image
        && payload.member_three.id_image
      ) {
        await Team.findById(_id).then(async (team) => {
          await axios.post(`${process.env.TELEGRAM_API_URL}${process.env.TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: 619360171,
            text: `UPDATE BIODATA\nStatus TIM: ${team.status ? 'AKTIF' : 'NON-AKTIF'}\n\nAda tim yang minta verifikasi nih, berikut URLnya\nhttps://playbox.erpn.us/team/${team._id}`,
          }).then(async () => {
            await axios.post(`${process.env.TELEGRAM_API_URL}${process.env.TELEGRAM_TOKEN}/sendMediaGroup`, {
              chat_id: 619360171,
              media: [
                {
                  type: 'photo',
                  media: payload.member_one.id_image,
                  caption: payload.member_one.role,
                },
                {
                  type: 'photo',
                  media: payload.member_two.id_image,
                  caption: payload.member_two.role,
                },
                {
                  type: 'photo',
                  media: payload.member_three.id_image,
                  caption: payload.member_three.role,
                },
              ],
            });
          });
        });
      }

      return Team.findByIdAndUpdate(_id, payload)
        .then(() => res
          .status(200)
          .json({
            error: false,
            message: 'Berhasil update biodata tim',
          }))
        .catch((e) => res.status(500).json({ error: false, message: e.message }));
    });
  },
  updateIdeaTeam: async (req, res) => {
    const { _id } = req.team;
    const { idea } = req.body;

    Team.findByIdAndUpdate(_id, { idea })
      .then(() => res
        .status(200)
        .json({ error: false, message: 'Berhasil update ide tim' }))
      .catch((e) => res.status(500).json({ error: true, message: e.message }));
  },
  teamPayment: async (req, res) => {
    const { _id } = req.team;
    const { paymentMethod } = req.query;

    await Team.findById(_id)
      .then(async (r) => {
        if (!paymentMethod) {
          return res.status(500).json({
            error: true,
            status: 5000,
            message: 'Silahkan pilih metode pembayaran!',
          });
        }

        if (r.category === '') {
          return res.status(500).json({
            error: true,
            status: 5004,
            message: 'Kategori masih kosong, silahkan update data anda!',
          });
        }

        if (!r.status) {
          return res.status(500).json({
            error: true,
            status: 5001,
            message: 'Akun belum di setujui oleh admin!',
          });
        }

        if (r.payment.status) {
          return res
            .status(500)
            .json({
              error: true,
              status: 5002,
              message: 'Anda sudah melakukan pembayaran!',
            });
        }

        const product = generateProduct(moment().format(), r.category);

        if (!product) {
          return res
            .status(500)
            .json({
              error: true,
              status: 5005,
              message: 'Registrasi ditutup!',
            });
        }

        const body = {
          account: process.env.VA_IPAYMU,
          product: [product.title],
          qty: ['1'],
          price: [product.price],
          returnUrl: 'https://plbx.coderitts.tech/#pembayaran',
          cancelUrl: 'https://plbx.coderitts.tech/#pembayaran',
          notifyUrl: `${process.env.NOTIFY_URL_IPAYMU}/${r._id}`,
          buyerName: r.name,
          buyerEmail: r.email,
          buyerPhone: r.phone,
          referenceId: r._id,
          // paymentMethod,
          expired: 1,
        };

        const payment = await callAPI(body, 'POST', `${process.env.API_URL_IPAYMU}/payment`);

        if (payment.Status !== 200) {
          const payload = {
            error: true,
            status: 5005,
            message: payment.Message,
          };
          return res.status(500).json(payload);
        }

        return Team.findByIdAndUpdate(_id, {
          payment: { status: false, sessionId: payment.Data.SessionID },
        })
          .then(() => {
            const payload = {
              error: false,
              data: {
                url: payment.Data.Url,
                sessionId: payment.Data.SessionID,
              },
            };

            return res.status(200).json(payload);
          })
          .catch(() => {
            const payload = {
              error: true,
              status: 5000,
              message: 'Akun anda tidak ditemukan!',
            };

            return res.status(500).json(payload);
          });
      })
      .catch(() => {
        res.status(500).json({
          error: true,
          status: 5000,
          message: 'Akun anda tidak ditemukan!',
        });
      });
  },
};
