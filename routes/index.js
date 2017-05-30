var express = require('express');
var router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/zbrain2db'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Z-Brain Atlas' });
});

/* GET entire imagesdb database as json*/
router.get('/api/imagesdb', (req, res, next) => {
	const results = [];

	pg.connect(connectionString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		const query = client.query('SELECT * FROM images ORDER BY image_id ASC;');

		query.on('row', (row) => {
			results.push(row);
		});

		query.on('end', () => {
			done();
			return res.json(results);
		});
	});

});

/* param for one line */
router.param('line', (req, res, next, id) => {
	const results = [];
	
	pg.connect(connectionString, (err, client, done) => {
		if (err) {
			done();	
			console.log(err);
			return res.status(500).json({success:false, data: err});
		}
		
		querySQL = `SELECT * FROM images
							WHERE line_name='${id}'`
		const query = client.query(querySQL);

		query.on('row', (row) => {
			results.push(row);
		});

		query.on('end', () => {
			done();
			req.line = results;
			return next();
		});
	});		

});

/* GET single line info as json */
router.get('/api/lines/:line', (req, res) => {
	res.json(req.line);
});

router.get('/api/lines', (req, res, next) => {
	const results = []

	pg.connect(connectionString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		
		querySQL = `SELECT line_name FROM images
								GROUP BY line_name
								ORDER BY line_name ASC; ` 

		const query = client.query(querySQL);

		query.on('row', (row) => {
			results.push(row);
		});
		
		query.on('end', () => {
			done();
			return res.json(results);
		});
		
	});
});

module.exports = router;
