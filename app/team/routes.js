const express = require('express');

const router = express.Router();
const { index, detailTeam, updateTeam } = require('./controller');
const { isLoginAdmin } = require('../../middleware/auth');

router.get('/', isLoginAdmin, index);
router.get('/:id', isLoginAdmin, detailTeam);
router.post('/:id/update', isLoginAdmin, updateTeam);

module.exports = router;
