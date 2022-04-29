const jwt = require('jsonwebtoken');
const Auth = require('./model');

module.exports = {
  index: async (req, res) => {
    res.render('auth/index', { title: 'Auth' });
  },
  actionSignin: async (req, res) => {
    const { username, password } = req.body;
    const tokenExpires = 3 * 24 * 60 * 60;

    await Auth.login(username, password)
      .then((r) => {
        const token = jwt.sign(
          {
            player: {
              id: r._id,
              username: r.username,
            },
          },
          process.env.JWT_KEY,
          { expiresIn: tokenExpires }
        );

        res.cookie('session', token, {
          httpOnly: true,
          maxAge: tokenExpires * 1000,
        });
        res.redirect('/');
      })
      .catch((e) => {
        console.log(e);
        res.redirect('/auth');
      });
  },
  actionSignout: (req, res) => {
    res.cookie('session', '', { maxAge: 1 });
    res.redirect('/auth');
  },
};
