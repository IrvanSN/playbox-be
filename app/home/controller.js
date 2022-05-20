const Team = require('../team/model');
const { callAPI } = require('../../config/ipaymu');

module.exports = {
  index: async (req, res) => {
    await Team.find({})
      .select('name email phone category status idea.title payment.status member_one.id_image member_two.id_image member_three.id_image')
      .limit(10)
      .sort({ createdAt: 'descending' })
      .then(async (r) => {
        const count = await Team.countDocuments({}).then((team) => team);
        const active = await Team.countDocuments({ status: true }).then((team) => team);
        const balance = await callAPI({ account: process.env.VA_IPAYMU }, 'POST', `${process.env.API_URL_IPAYMU}/balance`);

        const teamPaid = await Team.find({ 'payment.status': 'true' })
          .then((item) => {
            const mhs = item.filter((team) => team.category === 'MHS').length;
            const sma = item.filter((team) => team.category === 'SMA').length;
            const int = item.filter((team) => team.category === 'INT').length;
            const total = item.length;

            return {
              mhs, sma, int, total,
            };
          }).catch(() => ({
            mhs: 0, sma: 0, int: 0, total: 0,
          }));

        const teamUnpaid = await Team.find({ 'payment.status': 'false' })
          .then((item) => {
            const mhs = item.filter((team) => team.category === 'MHS').length;
            const sma = item.filter((team) => team.category === 'SMA').length;
            const int = item.filter((team) => team.category === 'INT').length;
            const total = item.length;

            return {
              mhs, sma, int, total,
            };
          }).catch(() => ({
            mhs: 0, sma: 0, int: 0, total: 0,
          }));

        res.render('home/index.ejs', {
          title: 'Home',
          team: r,
          count,
          active,
          balance: balance.Data.MerchantBalance,
          teamPaid,
          teamUnpaid,
        });
      })
      .catch(() => {
        res.redirect('/auth');
      });
  },
};
