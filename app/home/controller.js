const Console = require('console');
const Team = require('../team/model');
const { callAPI } = require('../../config/ipaymu');

module.exports = {
  index: async (req, res) => {
    await Team.find({})
      .select('name email phone category status idea.title payment.status member_one.id_image member_two.id_image member_three.id_image')
      .limit(10)
      .sort({ createdAt: 'descending' })
      .then(async (r) => {
        const count = await Team.countDocuments({}).then((r) => r);
        const active = await Team.countDocuments({ status: true }).then((r) => r);
        const balance = await callAPI({ account: process.env.VA_IPAYMU }, 'POST', `${process.env.API_URL_IPAYMU}/balance`);
        const paidCount = await Team.countDocuments({ payment: { status: true } }).then((r) => r);
        const mhsCount = await Team.countDocuments({ payment: { status: true }, category: 'MHS' }).then((r) => r);
        const smaCount = await Team.countDocuments({ payment: { status: true }, category: 'SMA' }).then((r) => r);
        const intCount = await Team.countDocuments({ payment: { status: true }, category: 'INT' }).then((r) => r);

        res.render('home/index.ejs', {
          title: 'Home',
          team: r,
          count,
          active,
          balance: balance.Data.MerchantBalance,
          paidCount,
          mhsCount,
          smaCount,
          intCount,
        });
      })
      .catch(() => {
        res.redirect('/auth');
      });
  },
};
