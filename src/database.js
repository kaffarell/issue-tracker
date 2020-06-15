var fs = require('fs');
const initSqlJs = require('sql.js');
var db;


function connectToDatabase(){
	console.log("Executing connect!");
	// Load wasm binary
	//const SQL = initSqlJs();
	const SQL = initSqlJs({
  		// Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
  		// You can omit locateFile completely when running in node
  		locateFile: `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.3.0/dist/sql-wasm.js`,
	});

	db = new SQL.Database();
	sqlstr = "CREATE TABLE issues (id TEXT, title TEXT, description TEXT, colon INT);";
	sqlstr += "INSERT INTO issues VALUES ('issue1', 'Add Boostrap', 'projectX', 0);";
	db.run(sqlstr);

	console.log("Stopped connect!");
}

function outputEverything(){
	console.log("output started!");
	let res = db.exec("SELECT * FROM issues");
	console.log(res);
	console.log("output stopped");
	
}

module.exports = {
	connectToDatabase,
	outputEverything,
}
