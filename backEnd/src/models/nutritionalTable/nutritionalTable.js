const execSQLQuery = require('../../database/connection');

const getFood = async (name, component, minValue, maxValue) => {
    let query = `
    SELECT *
    FROM NUTRITIONAL_TABLE
    WHERE 1 = 1
    `;

    const binds = {};

    if (name) {
        query += ' AND (NAME = :exactName OR NAME LIKE :partialName)';
        binds.exactName = name;
        binds.partialName = `%${name}%`;
    }

    if (component) {
        query += ' AND COMPONENT = :COMPONENT';
        binds.COMPONENT = component;
    }

    if (minValue && maxValue) {
        binds.minValue = minValue;
        binds.maxValue = maxValue;
        query += ' AND VALUE_PER_100G BETWEEN :minValue AND :maxValue';
    }

    if (minValue) {
        binds.minValue = minValue;
        query += ' AND VALUE_PER_100G >= :minValue';
    }

    if (maxValue) {
        query += ' AND VALUE_PER_100G <= :maxValue';
        binds.maxValue = maxValue;
    }

    try {
        console.log(query);
        const result = await execSQLQuery(query, binds);

        return result;

    } catch (error) {
        console.error("Erro na consulta SQL: " + error.message);
        throw error; // Você pode tratar o erro de maneira apropriada aqui
    }
};

const getComponent = async (name, component, minValue, maxValue) => {
    let query = `
    SELECT COMPONENT, MAX(ITEM_CODE) AS ITEM_CODE, MAX(NAME) AS NAME, MAX(UNITS) AS UNITS, MAX(VALUE_PER_100G) AS VALUE_PER_100G
    FROM NUTRITIONAL_TABLE
    WHERE 1 = 1
    `;

    const binds = {};

    if (name) {
        query += ' AND (NAME = :exactName OR NAME LIKE :partialName)';
        binds.exactName = name;
        binds.partialName = `%${name}%`;
    }

    if (component) {
        query += ' AND COMPONENT = :COMPONENT';
        binds.COMPONENT = component;
    }

    if (minValue && maxValue) {
        binds.minValue = minValue;
        binds.maxValue = maxValue;
        query += ' AND VALUE_PER_100G BETWEEN :minValue AND :maxValue';
    }

    if (minValue) {
        binds.minValue = minValue;
        query += ' AND VALUE_PER_100G >= :minValue';
    }

    if (maxValue) {
        query += ' AND VALUE_PER_100G <= :maxValue';
        binds.maxValue = maxValue;
    }

    query += ' GROUP BY COMPONENT';

    try {
        console.log(query);
        const result = await execSQLQuery(query, binds);

        return result;
    } catch (error) {
        console.error("Erro na consulta SQL: " + error.message);
        throw error; // Você pode tratar o erro de maneira apropriada aqui
    }
};

module.exports = {
    getFood,
    getComponent
};
