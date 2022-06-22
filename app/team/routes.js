const express = require('express');

const router = express.Router();
const {
  index, detailTeam, updateTeam, searchTeam, deleteTeam,
} = require('./controller');
const { isLoginAdmin } = require('../../middleware/auth');

router.get('/', isLoginAdmin, index);
router.get('/:id', isLoginAdmin, detailTeam);
router.post('/:id/update', isLoginAdmin, updateTeam);
router.post('/search', isLoginAdmin, searchTeam);
router.delete('/:id/delete', deleteTeam);

module.exports = router;
