const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const path = require('path')
const dbPath = path.resolve(__dirname, '../public/db/matser.db')
const axios = require('axios');
const cheerio = require('cheerio');
const utf8 = require('utf8')
const rp = require('request-promise');

// let db = new sqlite3.Database(dbPath, (err) => { 
// 	if (err) { 
// 			console.log('Error when creating the database', err) 
// 	} else { 
// 			console.log('Database created!') 
// 	} 
// });

router.get('/', function(req, res, next) {
	console.log(req, res, next);
});

// router.get('/site/insert', function(req, res, next) {
// 	console.log(req, res, next);
// });



module.exports = router;