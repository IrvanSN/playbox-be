const express = require('express');
const { notify } = require('./controller');

const router = express.Router();

router.post('/notify', notify);

module.exports = router;
