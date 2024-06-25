const mysql = require("mysql");
// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});

website_constants = function (callback) {
  let sql = "SELECT name,value FROM website_constants ";
  db.query(sql, function (err, data) {
    if (err) {
      callback(err.sqlMessage);
    } else {
      callback(null, data);
    }
  });
};

global.db = db;
