const mysql = require('mysql2');

// connect to mysql database
const connection = mysql.createConnection({
  host: '127.0.0.1', //if on a pc you could change this localhost.  On a mac, you probably want to keep this as 127.0.0.1
  user: 'root', //or your mySQL username
  password: '', //put your password here if your mysql is password protected
  database: 'employee_dir', //the name of the database from schema.sql
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');
});

module.exports = connection;