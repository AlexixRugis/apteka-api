const db = require('../DbModule');

module.exports = async (user) => {
    const data = await db.all(`SELECT * FROM products_users JOIN products ON products.id = products_users.product_id WHERE user_id = ? AND quantity < optimal_quantity`, [user.id]);
    if (data != null) {
      data.forEach((v) => {
        v.id = undefined;
        v.user_id = undefined;
      })
    }
    return data;
};