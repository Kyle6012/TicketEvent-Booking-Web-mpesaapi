const sqlite3 = require('sqlite3').verbose();
// const mysql = require('mysql2');

const db = new sqlite3.Database(':memory:');  // For SQLite
// Uncomment the following for MySQL setup
/*
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'gala_ticketing'
});
db.connect((err) => { if (err) throw err; console.log("MySQL Connected!"); });
*/

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phoneNumber TEXT,
    email TEXT,
    amount REAL,
    ticketNumber TEXT
  )`);
});

module.exports = db;
