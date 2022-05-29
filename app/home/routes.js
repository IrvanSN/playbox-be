const express = require('express');

const router = express.Router();
const { index, test } = require('./controller');
const { isLoginAdmin } = require('../../middleware/auth');

router.get('/', isLoginAdmin, index);
router.get('/test', isLoginAdmin, test);

module.exports = router;
