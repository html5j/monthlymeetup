var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": "localhost",
    "user": "dev",
    "password": "dev"
});

connection.connect();

exports.connection = connection;
