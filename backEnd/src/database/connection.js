const oracledb = require('oracledb');
const dotenv = require('dotenv');
dotenv.config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

async function initialize() {
    await oracledb.createPool(dbConfig);
}

initialize();

const execSQLQuery = async (query, binds) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(query, binds, { autoCommit: true }); // Adicione { autoCommit: true }
        return result;
    } catch (error) {
        console.error('Erro na execução da consulta:', error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Erro ao fechar a conexão:', error);
            }
        }
    }
};

module.exports = execSQLQuery;
