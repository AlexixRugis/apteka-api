const db = require('../DbModule');

module.exports = async (user, warehouseId) => {
    const data = await db.all(`SELECT * FROM products_users JOIN products ON products.id = products_users.product_id WHERE user_id = ? AND warehouse_id = ?`, [user.id, warehouseId]);
    if (data != null) {
      data.forEach((v) => {
        v.id = undefined;
        v.user_id = undefined;
        v.optimal_quantity = undefined;
      })
    }
    return data;
};