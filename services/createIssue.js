const db = require('../DbModule');
const validateIssue = require('../validation/IssueValidation');

module.exports = async (user, data) => {
    const {error} = validateIssue(data);
    if (error) {
      return { status: 400, message: error.details[0].message };
    }

    const items = data.items;
    const uniqueItems = new Map();
    for (let i = 0; i < items.length; i++) {
      const curItem = items[i];
      if (uniqueItems.has(curItem.medicine_id)) {
        return {status:400, message:'issue must contain items with unique ids'};
      }

      const itemData = await db.get(`SELECT * FROM products_users JOIN products ON products.id = products_users.product_id WHERE user_id = ? AND product_id = ?`, [user.id, curItem.medicine_id]);
      if (itemData == null) {
        return {status: 404, message: `medicine with id=${curItem.medicine_id} not found`};
      }

      console.log(itemData);
      if (itemData.quantity < curItem.quantity) {
        return {status: 400, message: 'not enough medicines to create issue'};
      }

      uniqueItems.set(curItem.medicine_id, [curItem.quantity, itemData.quantity - curItem.quantity]);
    }

    console.log(uniqueItems);

    const currentDate = new Date().toISOString();
    const issue_id = await db.insert("INSERT INTO issue_requests (user_id, purpose, completed, createdTime) VALUES (?, ?, ?, ?)", [user.id, data.purpose, false, currentDate]);
    if (issue_id == null) {
      return {status:500, message: 'server error'};
    }

    const batch = new Array();
    uniqueItems.forEach((v, k) => {
      batch.push(
        ["INSERT INTO issue_requests_items (issue_id, product_id, quantity) VALUES (?, ?, ?)", issue_id, k, v[0]],
        ["UPDATE products_users SET quantity = ? WHERE user_id = ? AND product_id = ?", v[1], user.id, k]
      );
    });

    try {
      await db.runBatchAsync(batch);
      return {status: 200, message: 'ok'};
    } catch (e) {
      await db.delete(`DELETE FROM issue_requests WHERE id = ?`, [issue_id]);
      return {status: 500, message: 'server error'};
    }
};