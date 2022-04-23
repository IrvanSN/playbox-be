const jwt = require('jsonwebtoken');
const Team = require('../app/team/model');

module.exports = {
  isLoginTeam: async (req, res, next) => {
    try {
      const token = req.headers.authorization
        ? req.headers.authorization.replace('Bearer ', '')
        : null;

      const data = jwt.verify(token, process.env.JWT_KEY);
      await Team.findById(data.team.id)
        .then((r) => {
          req.team = r;
          req.token = token;

          next();
        })
        .catch(() => {
          res.status(500).json({
            error: true,
            message: 'Not authorized to access this resource!',
          });
        });
    } catch (err) {
      res.status(500).json({
        error: true,
        message: 'Not authorized to access this resource!',
      });
    }
  },
};
