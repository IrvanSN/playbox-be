const Team = require('./model');

module.exports = {
  index: async (req, res) => {
    const { status } = req.query;

    if (status === 'active') {
      Team.find({ status: true })
        .then((r) => {
          const count = r.length;

          return res.render('team/index.ejs', {
            title: 'Tim Aktif - PLAYBOX Season 3', team: r, status, count,
          });
        });
    } else if (status === 'inactive') {
      Team.find({ status: false })
        .then((r) => {
          const count = r.length;

          return res.render('team/index.ejs', {
            title: 'Tim Aktif - PLAYBOX Season 3', team: r, status, count,
          });
        });
    } else {
      Team.find({})
        .then((r) => {
          const count = r.length;

          return res.render('team/index.ejs', {
            title: 'Tim Aktif - PLAYBOX Season 3', team: r, status, count,
          });
        });
    }
  },
  detailTeam: async (req, res) => {
    const { id } = req.params;

    await Team.findById(id)
      .then((r) => {
        res.render('team/view-detail.ejs', { title: `${r.name} - PLAYBOX Season 3`, team: r });
      }).catch(() => {
        res.redirect('/');
      });
  },
  updateTeam: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    await Team.findByIdAndUpdate(id, { status })
      .then((r) => {
        res.redirect('/team');
      }).catch(() => {
        res.redirect('/');
      });
  },
  searchTeam: async (req, res) => {
    const { value } = req.body;
    const regex = new RegExp(value);

    Team.find({ name: { $regex: regex, $options: 'i' } })
      .then((r) => {
        console.log(r);
        const count = r.length;

        return res.render('team/index.ejs', {
          title: 'Tim Aktif - PLAYBOX Season 3', team: r, status: 'search', count,
        });
      });
  },
};
