"use strict";

var sqlite3 = require('sqlite3').verbose();
var { allIssues, addIssue, removeIssue, editIssue, Issue} = require('./model');
var db;

function connectToDB() {
    db = new sqlite3.Database('issues.db');
	console.log('Opened Database!');
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
	db.all("SELECT * FROM Issues", (err, rows) => {
        rows.forEach(function (row) {
			console.log(row.id + ": " + row.title, " : " + row.description + " : " + row.colon);
        });
    });
}

function loadFromDB(){
	let array = [];
	db.all("SELECT * FROM Issues", (err, rows) => {
		if(err){
			console.log("🤕: " + err);
		}
		for(let i = 0; i < rows.length; i++){
			let newIssue = new Issue(rows[i].id, rows[i].title, rows[i].description, rows[i].colon);
			array.push(newIssue);
		}
		return array;
	});
}

function removeIssueFromDB(issue) {
	let query = "DELETE FROM Issues WHERE id = ?";
	db.run(query, [issue.id], (err, result) => {
		if(err){
			console.log("🤕: " + err);
		}
		console.log(result);
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
	removeIssueFromDB,
	closeDb,
};
