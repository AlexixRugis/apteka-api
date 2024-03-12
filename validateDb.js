const fs = require('fs');
const path = require('path');
const sqlite3 = require("sqlite3").verbose();

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

    init = async () => {
        const products = await this.#all(`SELECT id FROM products`);
        const users = await this.#all(`SELECT id FROM users`);
        const warehouses = await this.#all(`SELECT id FROM warehouses`);

        users.forEach((u) => {
            products.forEach(async (p) => {
                const row = await this.#get(`SELECT id FROM products_users WHERE user_id = ? AND product_id = ?`, [u.id, p.id]);
                if (row == null) {
                    const warehouse = warehouses[Math.floor(Math.random()*warehouses.length)];
                    this.db.run(`INSERT INTO products_users (user_id, product_id, warehouse_id, quantity) VALUES (?, ?, ?, ?)`, [u.id, p.id, warehouse.id, 20]);
                }
            });
        });
    };
}

new DbModule('db.sqlite3').init();
