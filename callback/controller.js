const Team = require('../app/team/model');

module.exports = {
  notify: async (req, res) => {
    const { reference_id, status } = req.body;
    const updatedStatus = status === 'berhasil';
    console.log('req.rawHeaders:', req.rawHeaders);
    console.log('req.rawHeaders[1]:', req.rawHeaders[1]);

    Team.findByIdAndUpdate(reference_id, { status: updatedStatus })
      .then(() => {
        res.status(200).json({
          error: false,
          reqdotrawHeaders: req.rawHeaders,
          reqdotrawHeadersIndexOne: req.rawHeaders[1],
        });
      })
      .catch(() => {
        res.status(500).json({ error: true });
      });
  },
};
