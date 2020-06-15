var fs = require('fs');
var initSqlJs = require('sql-wasm.js');
var filebuffer = fs.readFileSync('issues.db');
const sqlite = require('sql.js');
var db;
	

function connectToDatabase(){
	const SQL = await initSqlJs({
		locateFile: file => 
	})
}

function outputEverything(){
	db.all('SELECT * FROM Issues',[], (err, rows) => {
		if(err)	{
			console.log(err);
		}
		console.log(rows)
	});
}

module.exports = {
	connectToDatabase,
	outputEverything,
}
