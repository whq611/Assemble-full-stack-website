const mysql = require('mysql');
const { getModuleLogger } = require('../utils');
const { dbConfig } = require('../config');

const logger = getModuleLogger(module);
const db = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  multipleStatements : true
});

function asyncQuery(...args) {
  return new Promise((resolve, reject) => {
    db.query(...args, (err, res) => {
      if (err) {
        logger.error('Query error');
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

module.exports = {
  query: asyncQuery,
};
