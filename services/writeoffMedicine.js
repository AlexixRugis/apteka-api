const db = require('../DbModule');
const validateWriteoff = require('../validation/WriteoffValidation');

module.exports = async (user, data) => {
    const {error} = validateWriteoff(data);
    if (error) {
      return { status: 400, message: error.details[0].message };
    }

    const oldData = await db.get(`SELECT * FROM products_users WHERE user_id = ? AND product_id = ?`, [user.id, data.medicine_id]);
    if (oldData == null) {
      return {status: 404, message: `medicine with id=${data.medicine_id} not found`};
    }
    const newQuantity = Math.floor(oldData.quantity - data.quantity);
    if (newQuantity < 0) {
      return {status:400, message: 'not enough medicine to writeoff'};
    }
    
    const currentDate = new Date().toISOString();
    const batch = [
      ["INSERT INTO product_writeoffs (user_id, product_id, quantity, reason, createdTime) VALUES (?, ?, ?, ?, ?);", user.id, data.medicine_id, data.quantity, data.reason, currentDate],
      ["UPDATE products_users SET quantity = ? WHERE user_id = ? AND product_id = ?;", newQuantity, user.id, data.medicine_id]
    ];

    try {
      await db.runBatchAsync(batch);
      return {status:200, message: "ok"}
    }
    catch (e) {
      console.log(e);
      return {status:500, message: "server error"};
    }
};