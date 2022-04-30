const Team = require('../app/team/model');

module.exports = {
  notify: async (req, res) => {
    const { reference_id, status } = req.body;
    const updatedStatus = status === 'berhasil';
    console.log('req.rawHeaders:', req.rawHeaders);
    console.log('req.rawHeaders[1]:', req.rawHeaders[1]);

    Team.findByIdAndUpdate(reference_id, { status: updatedStatus })
      .then(() => {
        res.status(200).json({ error: false });
      })
      .catch(() => {
        res.status(500).json({ error: true });
      });
  },
};
