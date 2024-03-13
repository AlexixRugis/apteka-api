const db = require('../DbModule');
const validateTransfer = require('../validation/TransferValidation');

module.exports = async (user, data) => {
    const {error} = validateTransfer(data);
    if (error) {
      return { status: 400, message: error.details[0].message };
    }
    
    const toWarehouse = await db.get(`SELECT id FROM warehouses WHERE id = ?`, data.warehouse_to);
    if (toWarehouse == null) {
      return {status: 404, message: 'warehouse to transfer to not found'};
    }
    
    const oldData = await db.get(`SELECT * FROM products_users WHERE user_id = ? AND product_id = ?`, [user.id, data.medicine_id]);
    if (oldData == null) {
      return {status: 404, message: `medicine with id=${data.medicine_id} not found`};
    }

    if (oldData.warehouse_id == data.warehouse_to) {
      return {status: 400, message: 'warehouses must not be equal'};
    }

    const currentDate = new Date().toISOString();
    const batch = [
      ["INSERT INTO products_transfers (user_id, product_id, warehouse_from, warehouse_to, createdTime) VALUES (?, ?, ?, ?, ?)", user.id, data.medicine_id, oldData.warehouse_id, data.warehouse_to, currentDate],
      ["UPDATE products_users SET warehouse_id = ? WHERE user_id = ? AND product_id = ?", data.warehouse_to, user.id, data.medicine_id]
    ];

    try {
      await db.runBatchAsync(batch);
      return {status: 200, message: 'ok'};
    } catch (e) {
      console.log(e);
      return {status: 500, message: 'server error'};
    }
};