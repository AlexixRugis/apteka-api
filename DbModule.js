const fs = require('fs');
const path = require('path');
const sqlite3 = require("sqlite3").verbose();

const validateWriteoff = require('./validation/WriteoffValidation');
const validateTransfer = require('./validation/TransferValidation');
const validateIssue = require('./validation/IssueValidation');
const validateInvoice = require('./validation/InvoiceValidation');

sqlite3.Database.prototype.runAsync = function (sql, ...params) {
  return new Promise((resolve, reject) => {
      this.run(sql, params, function (err) {
          if (err) return reject(err);
          resolve(this);
      });
  });
};

sqlite3.Database.prototype.runBatchAsync = function (statements) {
  var results = [];
  var batch = ['BEGIN', ...statements, 'COMMIT'];
  return batch.reduce((chain, statement) => chain.then(result => {
      results.push(result);
      return this.runAsync(...[].concat(statement));
  }), Promise.resolve())
  .catch(err => this.runAsync('ROLLBACK').then(() => Promise.reject(err +
      ' in statement #' + results.length)))
  .then(() => results.slice(2));
};

class DbModule {
    constructor(filename) {
        this.filename = filename;

        const db_name = path.join(__dirname, "data", filename);
        this.db = new sqlite3.Database(
            db_name,
            sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
            err => {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Successful connection to the database '${filename}'`);
            }
        );
    }

    #get(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.get(sql, params, (err, result) => {
            if (err) {
              console.log('Error running sql: ' + sql);
              console.log(err);
              resolve(null);
            } else {
              resolve(result);
            }
          });
        });
      }
    
    #all(sql, params = []) {
      return new Promise((resolve, reject) => {
        this.db.all(sql, params, (err, rows) => {
          if (err) {
            console.log('Error running sql: ' + sql);
            console.log(err);
            resolve(null);
          } else {
            resolve(rows);
          }
        });
      });
    }

    #insert(sql, params = []) {
      return new Promise((resolve, reject) => {
        this.db.run(sql, params, function (err) {
          if (err) {
            console.log('Error running sql: ' + sql);
            console.log(err);
            resolve(null);
          } else {
            resolve(this.lastID);
          }
        });
      });
    }

    #delete(sql, params = []) {
      return new Promise((resolve, reject) => {
        this.db.run(sql, params, function (err) {
          if (err) {
            console.log('Error running sql: ' + sql);
            console.log(err);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    }

    #update(sql, params = []) {
      return new Promise((resolve, reject) => {
        this.db.run(sql, params, function (err) {
          if (err) {
            console.log('Error running sql: ' + sql);
            console.log(err);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    }

    init = () => {
        const create_tables = fs.readFileSync(
            path.join(__dirname, "data", "schema.sql")
        ).toString();
        
        create_tables.split(";").forEach((item) => {
            this.db.run(item, err => {
                if (err) {
                  return console.error(err.message);
                }
            });
        });
    };

    getUser = async (apiKey) => {
        const data = await this.#get(`SELECT * FROM users WHERE apikey = ?`, [apiKey]);
        return data;
    }

    getWarehouses = async () => {
      const data = await this.#all(`SELECT * FROM warehouses`);
      return data;
    }

    getMedicines = async (user) => {
      const data = await this.#all(`SELECT * FROM products_users JOIN products ON products.id = products_users.product_id WHERE user_id = ?`, [user.id]);
      if (data != null) {
        data.forEach((v) => {
          v.user_id = undefined;
          v.optimal_quantity = undefined;
        })
      }
      return data;
    }

    getMedicinesInWarehouse = async (user, warehouseId) => {
      const data = await this.#all(`SELECT * FROM products_users JOIN products ON products.id = products_users.product_id WHERE user_id = ? AND warehouse_id = ?`, [user.id, warehouseId]);
      if (data != null) {
        data.forEach((v) => {
          v.user_id = undefined;
          v.optimal_quantity = undefined;
        })
      }
      return data;
    }

    getMedicinesRunningOut = async (user) => {
      const data = await this.#all(`SELECT * FROM products_users JOIN products ON products.id = products_users.product_id WHERE user_id = ? AND quantity < optimal_quantity`, [user.id]);
      if (data != null) {
        data.forEach((v) => {
          v.user_id = undefined;
        })
      }
      return data;
    }

    getWriteoffs = async (user) => {
      const data = await this.#all(`SELECT * FROM product_writeoffs JOIN products ON products.id = product_writeoffs.product_id WHERE user_id = ?`, [user.id]);
      if (data != null) {
        data.forEach((v) => {
          v.user_id = undefined;
          v.optimal_quantity = undefined;
        });
      }
      return data;
    }

    writeoffMedicine = async (user, data) => {
      const {error} = validateWriteoff(data);
      if (error) {
        return { status: 400, message: error.details[0].message };
      }

      const oldData = await this.#get(`SELECT * FROM products_users WHERE user_id = ? AND product_id = ?`, [user.id, data.medicine_id]);
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
        await this.db.runBatchAsync(batch);
        return {status:200, message: "ok"}
      }
      catch (e) {
        console.log(e);
        return {status:500, message: "server error"};
      }

    }

    getTransfers = async (user) => {
      const data = await this.#all(`SELECT * FROM products_transfers JOIN products ON products.id = products_transfers.product_id WHERE user_id = ?`, [user.id]);
      if (data != null) {
        data.forEach((v) => {
          v.user_id = undefined;
          v.optimal_quantity = undefined;
        });
      }
      return data;
    }

    transferMedicine = async (user, data) => {
      const {error} = validateTransfer(data);
      if (error) {
        return { status: 400, message: error.details[0].message };
      }
      
      const toWarehouse = await this.#get(`SELECT id FROM warehouses WHERE id = ?`, data.warehouse_to);
      if (toWarehouse == null) {
        return {status: 404, message: 'warehouse to transfer to not found'};
      }
      
      const oldData = await this.#get(`SELECT * FROM products_users WHERE user_id = ? AND product_id = ?`, [user.id, data.medicine_id]);
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
        await this.db.runBatchAsync(batch);
        return {status: 200, message: 'ok'};
      } catch (e) {
        console.log(e);
        return {status: 500, message: 'server error'};
      }
    }

    getAllIssues = async (user) => {
      const data = await this.#all(`SELECT * FROM issue_requests WHERE user_id = ?`, [user.id]);
      if (data != null) {
        data.forEach((v) => {
          v.user_id = undefined;
        });
      }
      return data;
    }

    getIssueDetails = async (user, issue_id) => {
      const data = await this.#get(`SELECT * FROM issue_requests WHERE id = ? AND user_id = ?`, [issue_id, user.id]);
      if (data == null) {
        return null;
      }

      const items = await this.#all(`SELECT * FROM issue_requests_items JOIN products ON products.id = issue_requests_items.product_id WHERE issue_id = ?`, [issue_id]);
      data.user_id = undefined;
      data.items = items;

      return data;
    };

    createIssue = async (user, data) => {
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

        const itemData = await this.#get(`SELECT * FROM products_users JOIN products ON products.id = products_users.product_id WHERE user_id = ? AND product_id = ?`, [user.id, curItem.medicine_id]);
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
      const issue_id = await this.#insert("INSERT INTO issue_requests (user_id, purpose, completed, createdTime) VALUES (?, ?, ?, ?)", [user.id, data.purpose, false, currentDate]);
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
        await this.db.runBatchAsync(batch);
        return {status: 200, message: 'ok'};
      } catch (e) {
        await this.#delete(`DELETE FROM issue_requests WHERE id = ?`, [issue_id]);
        return {status: 500, message: 'server error'};
      }
    }

    finishIssue = async (user, issue_id) => {
      const data = await this.#get(`SELECT * FROM issue_requests WHERE id = ? AND user_id = ?`, [issue_id, user.id]);
      if (data == null) {
        return {status:404, message: `issue with id=${issue_id} not found`};
      }
      
      if (data.completed) {
        return {status:400, message: 'issue is already completed'};
      }

      const res = this.#update(`UPDATE issue_requests SET completed=1 WHERE id = ? AND user_id = ?`, [issue_id, user.id]);
      if (!res) {
        return {status:500, message: 'server error'};
      }

      return {status: 200, message: 'ok'};
    }

    getAllInvoices = async (user) => {
      const data = await this.#all(`SELECT * FROM product_invoices WHERE user_id = ?`, [user.id]);
      if (data != null) {
        data.forEach((v) => {
          v.user_id = undefined;
        });
      }
      return data;
    }

    getInvoiceDetails = async (user, invoice_id) => {
      const data = await this.#get(`SELECT * FROM product_invoices WHERE id = ? AND user_id = ?`, [invoice_id, user.id]);
      if (data == null) {
        return null;
      }

      const items = await this.#all(`SELECT * FROM products_invoices_items JOIN products ON products.id = products_invoices_items.product_id WHERE invoice_id = ?`, [invoice_id]);
      data.user_id = undefined;
      data.items = items;

      return data;
    };

    createInvoice = async (user, data) => {
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

        const itemData = await this.#get(`SELECT id, quantity FROM products_users WHERE user_id = ? AND product_id = ?`, [user.id, curItem.medicine_id]);
        if (itemData == null) {
          return {status: 404, message: `medicine with id=${curItem.medicine_id} not found`};
        }

        if (new Date(curItem.expiration_date) < dateNow) {
          return {status: 400, message: `medicine with id=${curItem.medicine_id} is expired`};
        }

        uniqueItems.set(curItem.medicine_id, [curItem.quantity, itemData.quantity + curItem.quantity, curItem.price, curItem.expiration_date]);
      }

      const invoice_id = await this.#insert("INSERT INTO product_invoices (user_id, provider, createdTime) VALUES (?, ?, ?)", [user.id, data.provider, data.document_date]);
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
        await this.db.runBatchAsync(batch);
        return {status: 200, message: 'ok'};
      } catch (e) {
        await this.#delete(`DELETE FROM product_invoices WHERE id = ?`, [invoice_id]);
        return {status: 500, message: 'server error'};
      }
    };
}

module.exports = DbModule;