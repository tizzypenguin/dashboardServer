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

let settingList = function (siteRows, masterRows, detailRows) {
	let returnArr = [];

	console.log(siteRows, masterRows, detailRows);
	for(var site of siteRows) {
		returnArr.push(site);
	}
	for(var master of masterRows) {
		var no_site = master.no_site;
		var site = returnArr.filter(site => site.no = no_site);
		if(!site || site.length != 1 ) {
			return null;
		} else {
			if(!site[0].arr) {
				site[0].arr = [];
				site[0].arr.push(master);
			} else {
				site[0].arr.push(master);
			}
		}
	}
	
}

router.get('/list', function(req, res, next) {
	let siteRows, masterRows, detailRows = {};

	const params = [];
	db.all("SELECT NO_SITE AS no, NAME AS name, URL AS url, ASIS AS asis, TOBE AS tobe, YN_CHANGE AS yn_change FROM TBL_SITE", params, (err, rows) => {
		console.log("first:",rows);
		if(err) {
			res.status(400).json({"error":err.message});
			return;
		} else {
			// res.send(rows);
			siteRows = rows;
			db.all("SELECT NO_SITE AS no_site, NO_MASTER AS no, NAME AS name, DURATION AS duration, TAG AS tag FROM TBL_MASTER", params, (err, rows) => {
				console.log("second:",rows);
				if(err) {
					res.status(400).json({"error":err.message});
					return;
				} else {
					masterRows = rows;
					db.all("SELECT NO_MASTER AS no_matser, NO_DETAIL AS no, REG_DT_FROM AS dt_from, REG_DT_TO AS dt_to, DT_EXAM AS dt_exam, NO_NEXT AS no_next FROM TBL_DETAIL", params, (err, rows) => {
						console.log("third:",rows);
						if(err) {
							res.status(400).json({"error":err.message});
							return;
						} else {
							detailRows = rows;
							let settingList = settingList(siteRows, masterRows, detailRows);
							if(settingList) {
								res.send(settingList);
							} else {
								res.status(400).json({"error":"자료 구성 중 에러 발생"});
							}
							
						}
					})
				}
			});
		}
	})
});


module.exports = router;