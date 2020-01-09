const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const path = require('path')
const dbPath = path.resolve(__dirname, '../public/db/matser.db')
const axios = require('axios');
const cheerio = require('cheerio');
const utf8 = require('utf8')
const rp = require('request-promise');
const url = require('url');

let db = new sqlite3.Database(dbPath, (err) => { 
	if (err) { 
			console.log('Error when creating the database', err) 
	} else { 
			console.log('Database created!') 
	} 
});

router.get('/insert', function(req, res, next) {
	const params = url.parse(req.url,true);
	db.run("INSERT INTO SITE (SITE_NO, SITE_NAME, SITE_URL, SITE_ASIS, SITE_TOBE) VALUES (NULL, ?, ?, ?, ?)",
		[
			params.query.site_name,
			params.query.site_url,
			params.query.site_contents,
			params.query.site_contents
		]);
	res.send('test')
});

router.get('/select', function(req, res, next) {
	try{
		const params = url.parse(req.url,true);
		db.run("SELECT SITE_NO, SITE_NAME, SITE_URL, SITE_ASIS, SITE_TOBE FROM SITE WHERE SITE_NO = ?",
		[
			params.query.site_no
		]);
		res.send(1);
	} catch(e) {
		console.log(e);
		res.send(0);
	}
});

router.get('/update', function(req, res, next) {
	try{
		const params = url.parse(req.url,true);
		db.run("UPDATE SITE SET SITE_NAME=?, SITE_URL=?, SITE_ASIS=? WHERE SITE_NO= ?",
		[
			params.query.site_name,
			params.query.site_url,
			params.query.site_contents,
			params.query.site_no
		]);
	} catch(e) {
		console.log(e);
		res.send(0);
	}
});

router.get('/delete', function(req, res, next) {
	try{
		const params = url.parse(req.url,true);
		db.run("DELETE FROM SITE WHERE SITE_NO=?",
		[
			params.query.site_no
		]);
	} catch(e) {
		console.log(e);
		res.send(0);
	}
});

router.get('/selectBatch', function(req, res, next) {
	try{
		const params = url.parse(req.url,true);
		db.run("SELECT SITE_NO, SITE_URL, SITE_TOBE FROM SITE");
	} catch(e) {
		console.log(e);
		res.send(0);
	}
});

router.get('/updateBeforeBatch', function(req, res, next) {
	try{
		const params = url.parse(req.url,true);
		db.run("UPDATE SITE SET SITE_ASIS = (SELECT SITE_TOBE FROM SITE WHERE SITE_NO=?) WHERE SITE_NO = ?",
		[
			params.query.site_no,
			params.query.site_no
		]);
	} catch(e) {
		console.log(e);
		res.send(0);
	}
});

router.get('/updateBatch', function(req, res, next) {
	try{
		const params = url.parse(req.url,true);
		db.run("UPDATE SITE SET SITE_TOBE = ? WHERE SITE_NO = ?",
		[
			params.query.site_contents,
			params.query.site_no
		]);
	} catch(e) {
		console.log(e);
		res.send(0);
	}
});

module.exports = router;