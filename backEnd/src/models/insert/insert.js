const execSQLQuery = require('../../database/connection');

const insertData = async (data) => {
    try {
        // Consulta SQL para inserir dados com bind variables
        const query = `
        INSERT INTO CATEGORIAS_DE_ALIMENTOS (CODIGO, NOME, NOME_CIENTIFICO, GRUPO, MARCA)
        VALUES (:codigo, :nome, :nome_cientifico, :grupo, :marca)`;

        const binds = {
            codigo: data.codigo,
            nome: data.nome,
            nome_cientifico: data.nome_cientifico,
            grupo: data.grupo,
            marca: data.marca,
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
    insertData
};
