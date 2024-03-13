const db = require('../DbModule');

module.exports = async (user, issue_id) => {
    const data = await db.get(`SELECT * FROM issue_requests WHERE id = ? AND user_id = ?`, [issue_id, user.id]);
    if (data == null) {
      return null;
    }

    const items = await db.all(`SELECT * FROM issue_requests_items JOIN products ON products.id = issue_requests_items.product_id WHERE issue_id = ?`, [issue_id]);
    if (items != null) {
      items.forEach((v)=> {
        v.id = undefined;
        v.issue_id = undefined;
        v.optimal_quantity = undefined;
      })
    }
    data.user_id = undefined;
    data.items = items;

    return data;
};