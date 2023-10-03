const insertModel = require('../../models/insert/insert');

const insert = async (req, res) => {
    try {
        // Dados para inserção (você pode passá-los no corpo da solicitação)
        const { code, name, scientific_name, food_group, brand } = req.body;

        const data = {
            code,
            name,
            scientific_name,
            food_group,
            brand,
        };

        const result = await insertModel.insertData(data);

        return res.json({ message: 'Dados inseridos com sucesso' });
    } catch (error) {
        console.error('Erro no controlador de inserção: ' + error.message);
        return res.status(500).send('Erro ao inserir os dados no banco de dados Oracle');
    }
};

const insertDetails = async (req, res) => {
    try {
        // Dados para inserção (você pode passá-los no corpo da solicitação)
        const { item_code, component, units, value_per_100g, full_soup_spoon_24g, shallow_soup_spoon_19g } = req.body;

        const data = {
            item_code,
            component,
            units,
            value_per_100g,
            full_soup_spoon_24g,
            shallow_soup_spoon_19g,
        };

        console.log('data', data);

        const result = await insertModel.insertDetails(data); // Insert into CALORIC_DETAILS table

        return res.json({ message: 'Dados inseridos com sucesso' });
    } catch (error) {
        console.error('Erro no controlador de inserção: ' + error.message);
        return res.status(500).send('Erro ao inserir os dados no banco de dados Oracle');
    }
};


module.exports = {
    insert,
    insertDetails
};