"use strict";

var sqlite3 = require('sqlite3').verbose();
var { allIssues, addIssue, removeIssue, editIssue, Issue} = require('./model');
var db;

function connectToDB() {
    db = new sqlite3.Database('issues.db');
}


function saveToDB(issues){
	for(let i = 0; i < issues; i++){
		const query = 'INSERT INTO Issues (id, title, description, colon) VALUES (?, ?, ?, ?)';
		db.run(query, [issues[i].id, issues[i].title, issues[i].description, issues[i].colon], (err, result) => {
			if(err){
				console.log("🤕: " + err);
			}
			console.log(result);
		});
	}
}

function outputAll() {
    db.all("SELECT * FROM Issues", function(err, rows) {
        rows.forEach(function (row) {
			console.log(row.id + ": " + row.title, " : " + row.description + " : " + row.colon);
        });
    });
}

function loadFromDB(){
	let array = [];
	db.all("SELECT * FROM Issues", (err, rows) => {
		rows.forEach((row) => {
			let newIssue = new Issue(row.id, row.title, row.description, row.colon);
			array.push(newIssue);
		});
	});
}


function closeDb() {
    db.close();
}

module.exports = {
	connectToDB,
	saveToDB,
	outputAll,
	loadFromDB,
	closeDb,
};
