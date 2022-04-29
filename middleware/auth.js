const jwt = require('jsonwebtoken');
const Team = require('../app/team/model');

module.exports = {
  isLoginAdmin: async (req, res, next) => {
    const token = req.cookies.session;

    if (token) {
      jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
        if (err) {
          res.redirect('/auth');
        } else {
          next();
        }
      });
    } else {
      res.redirect('/auth');
    }
  },
  isLoginTeam: async (req, res, next) => {
    try {
      const token = req.headers.authorization
        ? req.headers.authorization.replace('Bearer ', '')
        : null;

      const data = jwt.verify(token, process.env.JWT_KEY);
      await Team.findById(data.team.id)
        .then((r) => {
          if (!r) {
            return res.status(500).json({
              error: true,
              message: 'Data tim tidak ditemukan atau token tidak valid!',
            });
          }

          req.team = r;
          req.token = token;

          next();
        })
        .catch((e) =>
          res.status(500).json({
            error: true,
            message: 'Data tim tidak ditemukan atau token tidak valid!',
          })
        );
    } catch (err) {
      return res.status(500).json({
        error: true,
        message: 'Not authorized to access this resource!',
      });
    }
  },
};
