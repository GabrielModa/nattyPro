const express = require("express");
const controller = require("../../controllers/nutritionalTable/nutritionalTable");

const router = express.Router();

// Rota para buscar por nome
// router.get("/:name",
//     controller.get);

// Rota para buscar com filtros opcionais
router.get("/:name?/:component?/:minValue?/:maxValue?",
    controller.get);


module.exports = router;
