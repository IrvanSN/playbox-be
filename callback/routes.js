const express = require('express');
const { notify } = require('./controller');

const router = express.Router();

router.post('/notify/:_id', notify);

module.exports = router;
