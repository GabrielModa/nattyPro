const express = require('express');
const controller = require('../../controllers/insert/insert');

const router = express.Router();

router.post('/',
    controller.insert);

router.post('/caloric-details',
    controller.insertDetails);

module.exports = router;
