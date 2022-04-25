const jwt = require('jsonwebtoken');
const multer = require('multer');
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
  { name: 'member_one_id_image' },
  { name: 'member_one_profile_image' },
  { name: 'member_two_id_image' },
  { name: 'member_two_profile_image' },
  { name: 'member_three_id_image' },
  { name: 'member_three_profile_image' },
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
              status: r.status,
              members: r.members,
            },
          },
          process.env.JWT_KEY
        );

        res.status(200).json({ error: false, data: { token } });
      })
      .catch((e) => {
        res.status(500).json({ error: true, message: e.message });
      });
  },
  addTeam: async (req, res) => {
    const { email, phone, password } = req.body;

    await Team.create({
      email,
      phone,
      password,
    })
      .then((r) => res.status(200).json({ error: false, data: r }))
      .catch(() => res.status(500).json({ error: true, data: null }));
  },
  updateTeam: async (req, res) => {
    console.log(req.body);
    const {
      category,
      idea_title,
      idea_description,
      member_one_name,
      member_one_institution,
      member_one_phone,
      member_one_role,
      member_one_email,
      member_two_name,
      member_two_institution,
      member_two_phone,
      member_two_role,
      member_two_email,
      member_three_name,
      member_three_institution,
      member_three_phone,
      member_three_role,
      member_three_email,
    } = req.body;

    upload(req, res, (err) => {
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
        idea: {
          title: idea_title,
          description: idea_description,
        },
        member_one: {
          name: member_one_name,
          role: member_one_role,
          email: member_one_email,
          institution: member_one_institution,
          phone: member_one_phone,
          id_image: req.files.member_one_id_image.path,
          profile_image: req.files.member_one_profile_image.path,
        },
        member_two: {
          name: member_two_name,
          role: member_two_role,
          email: member_two_email,
          institution: member_two_institution,
          phone: member_two_phone,
          id_image: req.files.member_two_id_image.path,
          profile_image: req.files.member_two_profile_image.path,
        },
        member_three: {
          name: member_three_name,
          role: member_three_role,
          email: member_three_email,
          institution: member_three_institution,
          phone: member_three_phone,
          id_image: req.files.member_three_id_image.path,
          profile_image: req.files.member_three_profile_image.path,
        },
      };

      return res
        .status(200)
        .json({ error: false, message: 'Berhasil update data tim' });
    });
  },
};
