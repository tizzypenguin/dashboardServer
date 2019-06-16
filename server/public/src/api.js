const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const path = require('path')
const dbPath = path.resolve(__dirname, '../db/matser.db')


let db = new sqlite3.Database(dbPath, (err) => { 
	if (err) { 
			console.log('Error when creating the database', err) 
	} else { 
			console.log('Database created!') 
	} 
})

router.get('/', function(req, res, next) {
	console.log('--------test-------');
	// db.run("SELECT * FROM TBL_SITE");
	let arr = [];
	db.all("SELECT NO_SITE AS NO, NAME, URL, ASIS, TOBE, YN_CHANGE FROM TBL_SITE", function(err, rows) {
		arr.push(rows);
	})
	console.log('--------//test-----------')
	console.log(arr);
	res.send(arr);
	console.log(arr);
});

module.exports = router;