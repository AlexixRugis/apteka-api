const fs = require('fs');
const path = require('path');
const sqlite3 = require("sqlite3").verbose();
const { dbFileName } = require('./config');

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

    get(sql, params = []) {
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
    
    all(sql, params = []) {
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

    insert(sql, params = []) {
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

    delete(sql, params = []) {
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

    update(sql, params = []) {
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

    runAsync = function (sql, ...params) {
      return new Promise((resolve, reject) => {
          this.db.run(sql, params, function (err) {
              if (err) return reject(err);
              resolve(this);
          });
      });
    };
    
    runBatchAsync = function (statements) {
      var results = [];
      var batch = ['BEGIN TRANSACTION', ...statements, 'COMMIT'];
      return batch.reduce((chain, statement) => chain.then(result => {
          results.push(result);
          return this.runAsync(...[].concat(statement));
      }), Promise.resolve())
      .catch(err => this.runAsync('ROLLBACK').then(() => Promise.reject(err +
          ' in statement #' + results.length)))
      .then(() => results.slice(2));
    };

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
}

const db = new DbModule(dbFileName);
db.init();

module.exports = db;