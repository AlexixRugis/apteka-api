const db = require('../DbModule');

module.exports = async (apiKey) => {
    const data = await db.get(`SELECT * FROM users WHERE apikey = ?`, [apiKey]);
    return data;
};