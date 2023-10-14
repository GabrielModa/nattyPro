const Model = require("../../models/nutritionalTable/nutritionalTable");

const get = async (req, res) => {
    try {
        const { name, component, minValue, maxValue } = req.query;

        console.log(`query: Controllers:` ,name, component, minValue, maxValue);

        const getFood = await Model.getFood(name, component, Number(minValue), Number(maxValue));
        const getComponent = await Model.getComponent(name, component, Number(minValue), Number(maxValue));

        const responseObj = {
            getFood,
            getComponent
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
