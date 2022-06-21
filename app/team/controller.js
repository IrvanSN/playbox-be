const moment = require('moment');
const Team = require('./model');

moment.locale('id');

module.exports = {
  index: async (req, res) => {
    const { status } = req.query;

    if (status === 'active') {
      Team.find({ status: true })
        .select('createdAt name email phone category status idea.title payment.status member_one.id_image member_two.id_image member_three.id_image')
        .then((r) => {
          const count = r.length;

          return res.render('team/index.ejs', {
            title: 'Tim Aktif - PLAYBOX Season 3', team: r, status, count, moment,
          });
        });
    } else if (status === 'inactive') {
      Team.find({ status: false })
        .select('createdAt name email phone category status idea.title payment.status member_one.id_image member_two.id_image member_three.id_image')
        .then((r) => {
          const count = r.length;

          return res.render('team/index.ejs', {
            title: 'Tim Non-Aktif - PLAYBOX Season 3', team: r, status, count, moment,
          });
        });
    } else if (status === 'official-team') {
      Team.find({ status: true, 'payment.status': 'true' })
        .select('createdAt name email phone category status idea.title payment.status member_one.id_image member_two.id_image member_three.id_image')
        .then((r) => {
          const team = r.filter((item) => (item.member_one.id_image !== '' && item.member_two.id_image !== '' && item.member_three.id_image !== ''));
          const count = r.length;

          return res.render('team/index.ejs', {
            title: 'Tim Official - PLAYBOX Season 3', team, status, count, moment,
          });
        });
    } else if (status === 'need-approval') {
      Team.find({ status: false })
        .select('createdAt name email phone category status idea.title payment.status member_one.id_image member_two.id_image member_three.id_image')
        .then((r) => {
          const team = r.filter((item) => (item.member_one.id_image !== '' && item.member_two.id_image !== '' && item.member_three.id_image !== ''));
          const count = team.length;

          return res.render('team/index.ejs', {
            title: 'Tim Official - PLAYBOX Season 3', team, status, count, moment,
          });
        });
    } else {
      Team.find({})
        .select('createdAt name email phone category status idea.title payment.status member_one.id_image member_two.id_image member_three.id_image')
        .then((r) => {
          const count = r.length;

          return res.render('team/index.ejs', {
            title: 'Semua Tim - PLAYBOX Season 3', team: r, status, count, moment,
          });
        });
    }
  },
  detailTeam: async (req, res) => {
    const { id } = req.params;

    await Team.findById(id)
      .then((r) => {
        res.render('team/view-detail.ejs', { title: `${r.name} - PLAYBOX Season 3`, team: r, status: undefined });
      }).catch(() => {
        res.redirect('/');
      });
  },
  updateTeam: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    await Team.findByIdAndUpdate(id, { status })
      .then(async (r) => {
        if (r.category === 'INT') {
          await Team.findByIdAndUpdate(id, { payment: { status } })
            .then(() => res.redirect('/team'))
            .catch(() => res.redirect('/'));
        } else {
          return res.redirect('/team');
        }
      }).catch(() => {
        res.redirect('/');
      });
  },
  searchTeam: async (req, res) => {
    const { value } = req.body;
    const regex = new RegExp(value);

    Team.find({ name: { $regex: regex, $options: 'i' } })
      .then((r) => {
        const count = r.length;

        return res.render('team/index.ejs', {
          title: 'Cari Tim - PLAYBOX Season 3', team: r, status: 'search', count,
        });
      });
  },
};
