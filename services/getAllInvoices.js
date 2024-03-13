const db = require('../DbModule');

module.exports = async (user) => {
    const data = await db.all(`SELECT * FROM product_invoices WHERE user_id = ?`, [user.id]);
    if (data != null) {
      data.forEach((v) => {
        v.user_id = undefined;
      });
    }
    return data;
};