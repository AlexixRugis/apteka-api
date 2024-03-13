const db = require('../DbModule');

module.exports = async () => {
    const data = await db.all(`SELECT * FROM warehouses`);
    return data;
};