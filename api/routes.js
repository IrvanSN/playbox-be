const express = require('express');

const router = express.Router();
const {
  addTeam,
  signin,
  updateIdeaTeam,
  updateBiodataTeam,
  teamPayment,
  getTeamById,
  getTeam,
} = require('./controller');
const { isLoginTeam } = require('../middleware/auth');

router.post('/signin', signin);
router.post('/team/add', addTeam);
router.get('/team/:id', getTeamById);
router.get('/team', isLoginTeam, getTeam);
router.put('/team/idea', isLoginTeam, updateIdeaTeam);
router.put('/team/biodata', isLoginTeam, updateBiodataTeam);
router.post('/team/payment', isLoginTeam, teamPayment);

module.exports = router;
