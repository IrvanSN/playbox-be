const Team = require('./model');

module.exports = {
  index: async (req, res) => {
    res.send('ok');
  },
  detailTeam: async (req, res) => {
    const { id } = req.params;

    await Team.findById(id)
      .then((r) => {
        res.render('team/index.ejs', { title: `${r.name} - PLAYBOX Season 3`, team: r });
      }).catch(() => {
        res.redirect('/');
      });
  },
  updateTeam: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    await Team.findByIdAndUpdate(id, { status })
      .then((r) => {
        res.redirect(`/team/${r._id}`);
      }).catch(() => {
        res.redirect('/');
      });
  },
};
