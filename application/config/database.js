const mysql = require('mysql2'); // Import mysql2

let dbJson;
if (process.env["NODE_ENV"] === "production") {
    dbJson = require("./database.json");
} else {
    console.log("Using dev database");
    dbJson = require("./database.dev.json");
}

const connection = mysql.createPool(dbJson.database); // Create a pool

connection.getConnection((err, conn) => { // Ensure connection works properly
    if (err) {
        console.error('Error connecting to database: ', err);
    } else {
        console.log('Successfully connected to the database.');
        conn.release(); // Release the connection
    }
});

module.exports = connection; // Export the connection