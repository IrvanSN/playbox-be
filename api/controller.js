const jwt = require('jsonwebtoken');
const Team = require('../app/team/model');

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
    const status = false;

    await Team.create({
      email,
      phone,
      password,
      status,
    })
      .then((r) => res.status(200).json({ error: false, data: r }))
      .catch(() => res.status(500).json({ error: true, data: null }));
  },
  updateTeam: async (req, res) => {
    const { category, institution, members, idea } = req.body;

    console.log(category, institution, members, idea);
  },
};
