const express = require('express');

const router = express.Router();
const {
  addTeam,
  signin,
  updateTeam,
  teamPayment,
  getTeam,
} = require('./controller');
const { isLoginTeam } = require('../middleware/auth');

router.post('/signin', signin);
router.post('/team/add', addTeam);
router.get('/team/:id', getTeam);
router.put('/team/update', isLoginTeam, updateTeam);
router.post('/team/payment', isLoginTeam, teamPayment);

module.exports = router;
