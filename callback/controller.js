const Team = require('../app/team/model');

module.exports = {
  notify: async (req, res) => {
    const { reference_id, status } = req.body;
    const updatedStatus = status === 'berhasil';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log('ip headers:', ip);
    console.log('req.hostname:', req.hostname);
    console.log('req.ip:', req.ip);
    console.log('req.ips:', req.ips);
    console.log('req.body:', req.body);

    Team.findByIdAndUpdate(reference_id, { status: updatedStatus })
      .then(() => {
        res.status(200).json({
          error: false,
        });
      })
      .catch(() => {
        res.status(500).json({ error: true });
      });
  },
};
