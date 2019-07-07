const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const path = require('path')
const dbPath = path.resolve(__dirname, '../db/matser.db')
const axios = require('axios');
const cheerio = require('cheerio');
const utf8 = require('utf8')
const fn = require('./fn.js')
const rp = require('request-promise');

let db = new sqlite3.Database(dbPath, (err) => { 
	if (err) { 
			console.log('Error when creating the database', err) 
	} else { 
			console.log('Database created!') 
	} 
})

router.get('/list', function(req, res, next) {
	let siteRows, masterRows, detailRows = {};

	const params = [];
	db.all("SELECT NO_SITE AS no, NAME AS name, URL AS url, ASIS AS asis, TOBE AS tobe, YN_CHANGE AS yn_change FROM TBL_SITE", params, (err, rows) => {
		// console.log("first:",rows);
		if(err) {
			res.status(400).json({"error":err.message});
			return;
		} else {
			// res.send(rows);
			siteRows = rows;
			db.all("SELECT NO_SITE AS no_site, NO_MASTER AS no, NAME AS name, DURATION AS duration, TAG AS tag FROM TBL_MASTER", params, (err, rows) => {
				// console.log("second:",rows);
				if(err) {
					res.status(400).json({"error":err.message});
					return;
				} else {
					masterRows = rows;
					db.all("SELECT NO_MASTER AS no_matser, NO_DETAIL AS no, REG_DT_FROM AS dt_from, REG_DT_TO AS dt_to, DT_EXAM AS dt_exam, NO_NEXT AS no_next FROM TBL_DETAIL", params, (err, rows) => {
						// console.log("third:",rows);
						if(err) {
							res.status(400).json({"error":err.message});
							return;
						} else {
							detailRows = rows;
							let settingList = fn.rubbish.settingList(siteRows, masterRows, detailRows);
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

// const getHtml = async () => {
// 	try {
// 		return await axios.get("http://www.q-net.or.kr/crf021.do?id=crf02101s03&IMPL_YY=2019&SERIES_CD=03");
// 	} catch (error) {
// 		console.error(error);
// 		return null;
// 	}
// };
// const getHtml = function() {
// 	try {
// 		return axios.get("http://www.q-net.or.kr/crf021.do?id=crf02101s03&IMPL_YY=2019&SERIES_CD=03");
// 	} catch (error) {
// 		console.error(error);
// 		return null;
// 	}
// };

// router.get('/get', function(req, res, next) {
// 	getHtml().then(html => {
// 		if(html) {
// 			res.send({html: html});
// 		} else {
// 			res.status(400).json({"error":"사이트 조회에 실패했습니다"})
// 		}
// 	});
// });
// const getHtml = function(callback) {
// 	try {
// 		let html = axios.get("http://www.q-net.or.kr/crf021.do?id=crf02101s03&IMPL_YY=2019&SERIES_CD=03");
// 		if(callback) {
// 			callback(html);
// 		}
// 		return null;
// 	} catch (error) {
// 		console.error(error);
// 		return null;
// 	}
// };



router.get('/get', function(req, res, next) {
  rp("http://www.q-net.or.kr/crf021.do?id=crf02101s03&IMPL_YY=2019&SERIES_CD=03")
  // rp("https://google.com")
	.then(function(html){
	  if(html) {
      console.log(html);
      res.send({html: html});
	  } else {
      res.status(400).json({"error":"사이트 조회에 실패했습니다"})
    }
	})
	.catch(function(err){
    console.log(err);
		res.status(400).json({"error":"사이트 조회에 실패했습니다"})
	});
});




module.exports = router;