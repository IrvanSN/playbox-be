const axios = require('axios');
const Team = require('../app/team/model');

module.exports = {
  notify: async (req, res) => {
    const { _id } = req.params;
    const {
      reference_id, status, sid, via, total, trx_id, buyer_name,
    } = req.body;

    console.log(req.body);

    await axios.post(`${process.env.TELEGRAM_API_URL}${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: 619360171,
      text: `CALLBACK RECEIVED\nReference Id: ${reference_id}\nTeam Name: ${buyer_name}\nStatus: ${status}\n\n${JSON.stringify(req.body)}`,
    });

    Team.findById(_id)
      .then((r) => {
        if (r.payment.sessionId !== sid) {
          return res.status(500).json({ error: true });
        }

        if (status === 'berhasil') {
          Team.findByIdAndUpdate(reference_id, {
            payment: {
              transactionId: trx_id,
              sessionId: r.payment.sessionId,
              status: status === 'berhasil',
              via,
              total: parseInt(total, 10),
            },
          })
            .then(() => res.status(200).json({
              error: false,
            }))
            .catch(() => res.status(500).json({
              error: true,
            }));
        }
      })
      .catch(() => res.status(500).json({ error: true }));
  },
};
