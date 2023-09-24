require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const { login } = require("./src/routes/index.routes");

app.use("/", login);

app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta: ${PORT}`);
});