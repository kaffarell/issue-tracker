"use strict";

var sqlite3 = require('sqlite3').verbose();
var db;

function connectToDB() {
	console.log("Connect to database.. ");
    db = new sqlite3.Database('issues.db');
	readAllRows();
}

function readAllRows() {
    console.log("readAllRows Issues");


    db.all("SELECT * FROM Issues", function(err, rows) {
        rows.forEach(function (row) {
			console.log(row.id + ": " + row.title, " : " + row.description);
        });
    });
	closeDb();
}

function closeDb() {
    console.log("closeDb");
    db.close();
}

module.exports = {
	connectToDB,
	readAllRows,
	closeDb,
};
