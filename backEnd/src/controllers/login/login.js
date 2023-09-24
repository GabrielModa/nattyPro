const Model = require("../../models/login/login");

const get = async (req, res) => {
    try {
        const login = await Model.get();

        const responseObj = {
            login,
        };

        return res.json(responseObj);

    } catch (error) {
        console.error("Erro no controlador: " + error.message);
        return res.status(500).send('Erro ao executar as queries no banco de dados');
    }
};

module.exports = {
    get,
};
