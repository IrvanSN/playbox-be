const Team = require('../app/team/model');

module.exports = {
  notify: async (req, res) => {
    const { _id } = req.params;
    const { reference_id, status, sid, via, total } = req.body;
    const updatedStatus = status === 'berhasil';

    Team.findById(_id)
      .then((r) => {
        if (r.payment.sessionId !== sid) {
          return res.status(500).json({ error: true });
        }

        Team.findByIdAndUpdate(reference_id, {
          status: updatedStatus,
          payment: {
            sessionId: r.payment.sessionId,
            status,
            via,
            total: parseInt(total, 10),
          },
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
