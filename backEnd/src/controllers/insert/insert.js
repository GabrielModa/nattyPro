const insertModel = require('../../models/insert/insert');

const insert = async (req, res) => {
    try {
        // Dados para inserção (você pode passá-los no corpo da solicitação)
        const { codigo, nome, nome_cientifico, grupo, marca } = req.body;

        const data = {
            codigo,
            nome,
            nome_cientifico,
            grupo,
            marca,
        };

        const result = await insertModel.insertData(data);

        return res.json({ message: 'Dados inseridos com sucesso' });
    } catch (error) {
        console.error('Erro no controlador de inserção: ' + error.message);
        return res.status(500).send('Erro ao inserir os dados no banco de dados Oracle');
    }
};

module.exports = {
    insert,
};
