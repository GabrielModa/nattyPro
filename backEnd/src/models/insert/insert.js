const execSQLQuery = require('../../database/connection');

const insertData = async (data) => {
    try {
        // Consulta SQL para inserir dados com bind variables
        const query = `
         INSERT INTO FOOD_CATEGORIES (CODE, NAME, SCIENTIFIC_NAME, FOOD_GROUP, BRAND)
         VALUES (:CODE, :NAME, :SCIENTIFIC_NAME, :FOOD_GROUP, :BRAND)`;

        const { code, name, scientific_name, food_group, brand } = data;

        const binds = {
            code,
            name,
            scientific_name,
            food_group,
            brand,
        };

        console.log('Executando consulta SQL:', query);
        console.log('Binds:', binds);

        const result = await execSQLQuery(query, binds);

        console.log('Resultado da consulta SQL:', result);

        return result;
    } catch (error) {
        throw error;
    }
};

const insertDetails = async (data) => {
    try {
        // Consulta SQL para inserir dados com bind variables na tabela CALORIC_DETAILS
        const query = `
         INSERT INTO CALORIC_DETAILS (ITEM_CODE, COMPONENT, UNITS, VALUE_PER_100G, FULL_SOUP_SPOON_24G, SHALLOW_SOUP_SPOON_19G)
         VALUES (:ITEM_CODE, :COMPONENT, :UNITS, :VALUE_PER_100G, :FULL_SOUP_SPOON_24G, :SHALLOW_SOUP_SPOON_19G)`;

        const { item_code, component, units, value_per_100g, full_soup_spoon_24g, shallow_soup_spoon_19g } = data;

        const binds = {
            ITEM_CODE: item_code,
            COMPONENT: component,
            UNITS: units,
            VALUE_PER_100G: value_per_100g,
            FULL_SOUP_SPOON_24G: full_soup_spoon_24g,
            SHALLOW_SOUP_SPOON_19G: shallow_soup_spoon_19g,
        };

        console.log('Executando consulta SQL:', query);
        console.log('Binds:', binds);

        const result = await execSQLQuery(query, binds);

        console.log('Resultado da consulta SQL:', result);

        return result;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    insertData,
    insertDetails
};
