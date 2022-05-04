const Team = require('../app/team/model');

module.exports = {
  notify: async (req, res) => {
    const { reference_id, status, sid, via } = req.body;
    const updatedStatus = status === 'berhasil';

    Team.findById(reference_id)
      .then((r) => {
        if (r.paymentSessionId !== sid) {
          return res.status(500).json({ error: true });
        }

        Team.findByIdAndUpdate(reference_id, {
          status: updatedStatus,
          payment: { status, via },
        })
          .then(() =>
            res.status(200).json({
              error: false,
            })
          )
          .catch(() =>
            res.status(500).json({
              error: true,
            })
          );
      })
      .catch(() => res.status(500).json({ error: true }));
  },
};
