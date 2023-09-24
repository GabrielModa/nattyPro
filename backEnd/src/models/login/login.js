const execSQLQuery = require('../../database/connection');

const get = async () => {
    const query = `SELECT SYSDATE FROM DUAL`;

    const result = await execSQLQuery(query);
    return result;
};

module.exports = {
    get
};