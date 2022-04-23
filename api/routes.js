const express = require('express');

const router = express.Router();
const { addTeam, signin, updateTeam } = require('./controller');
const { isLoginTeam } = require('../middleware/auth');

router.post('/signin', signin);
router.post('/team/add', addTeam);
router.put('/team/update', isLoginTeam, updateTeam);

module.exports = router;
