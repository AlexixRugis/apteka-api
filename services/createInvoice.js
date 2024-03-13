const db = require('../DbModule');
const validateInvoice = require('../validation/InvoiceValidation');

module.exports = async (user, data) => {
    const {error} = validateInvoice(data);
    if (error) {
      return { status: 400, message: error.details[0].message };
    }

    const dateNow = new Date();
    const items = data.items;
    const uniqueItems = new Map();
    for (let i = 0; i < items.length; i++) {
      const curItem = items[i];
      if (uniqueItems.has(curItem.medicine_id)) {
        return {status:400, message:'issue must contain items with unique ids'};
      }

      const itemData = await db.get(`SELECT id, quantity FROM products_users WHERE user_id = ? AND product_id = ?`, [user.id, curItem.medicine_id]);
      if (itemData == null) {
        return {status: 404, message: `medicine with id=${curItem.medicine_id} not found`};
      }

      if (new Date(curItem.expiration_date) < dateNow) {
        return {status: 400, message: `medicine with id=${curItem.medicine_id} is expired`};
      }

      uniqueItems.set(curItem.medicine_id, [curItem.quantity, itemData.quantity + curItem.quantity, curItem.price, curItem.expiration_date]);
    }

    const invoice_id = await db.insert("INSERT INTO product_invoices (user_id, provider, createdTime) VALUES (?, ?, ?)", [user.id, data.provider, data.document_date]);
    if (invoice_id == null) {
      return {status:500, message: 'server error'};
    }

    const batch = new Array();
    uniqueItems.forEach((v, k) => {
      batch.push(
        ["INSERT INTO products_invoices_items (invoice_id, product_id, price, quantity, expiration_date) VALUES (?, ?, ?, ?, ?)", invoice_id, k, v[2], v[0], v[3]],
        ["UPDATE products_users SET quantity = ? WHERE user_id = ? AND product_id = ?", v[1], user.id, k]
      );
    });

    try {
      await db.runBatchAsync(batch);
      return {status: 200, message: 'ok'};
    } catch (e) {
      await db.delete(`DELETE FROM product_invoices WHERE id = ?`, [invoice_id]);
      return {status: 500, message: 'server error'};
    }
};