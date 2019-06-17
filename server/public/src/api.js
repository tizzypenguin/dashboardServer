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
	let arr = [];
	const params = [];
	db.all("SELECT NO_SITE AS no, NAME AS name, URL AS url, ASIS AS asis, TOBE AS tobe, YN_CHANGE AS yn_change FROM TBL_SITE", params, (err, rows) => {
		if(err) {
			res.status(400).json({"error":err.message});
			return;
		} else {
			// res.json({
			// 	"message":"success",
			// 	"data":rows
			// })
			res.send(rows);
		}
	})
});

module.exports = router;