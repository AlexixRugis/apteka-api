const db = require('../DbModule');

module.exports = async (user, invoice_id) => {
    const data = await db.get(`SELECT * FROM product_invoices WHERE id = ? AND user_id = ?`, [invoice_id, user.id]);
    if (data == null) {
      return null;
    }

    const items = await db.all(`SELECT * FROM products_invoices_items JOIN products ON products.id = products_invoices_items.product_id WHERE invoice_id = ?`, [invoice_id]);
    if (items != null) {
      items.forEach((v)=> {
        v.id = undefined;
        v.invoice_id = undefined;
        v.optimal_quantity = undefined;
      })
    }
    data.user_id = undefined;
    data.items = items;

    return data;
};