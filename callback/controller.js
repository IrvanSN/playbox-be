module.exports = {
  notify: async (req, res) => {
    console.log(req.body);
    res.status(200).json({ error: false });
  },
};
