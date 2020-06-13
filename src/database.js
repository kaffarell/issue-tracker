const sqlite = require('sqlite3');
const db = new sqlite.Database('./issues.db');

function getAll() {
	return new Promise((resolve, reject) => {
		const query = 'SELECT * FROM Issues';
		db.all(query, (error, results) => {
			if(error){
				reject(error);
			}else{
				resolve(results);
			}
		});
	});
}


function insert(id, title, description){
	return new Promise((resolve, reject) => {
		const query = 'INSERT INTO Issues (idclass, title, description) VALUES (?, ?)';
		db.run(query, [id, title, description], (error, results) => {
			if(error) {
				reject(error);
			}else {
				resolve(results);
			}
		});
	});
}

module.exports = {
	getAll,
	insert(id, title, description),
}
