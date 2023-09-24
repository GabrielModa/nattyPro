const express = require("express");
const controller = require("../../controllers/login/login");

const router = express.Router();

router.get("/", controller.get);

module.exports = router;
