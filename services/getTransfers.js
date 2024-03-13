const db = require('../DbModule');

module.exports = async (user) => {
    const data = await db.all(`SELECT * FROM products_transfers JOIN products ON products.id = products_transfers.product_id WHERE user_id = ?`, [user.id]);
    if (data != null) {
      data.forEach((v) => {
        v.user_id = undefined;
        v.optimal_quantity = undefined;
      });
    }
    return data;
};