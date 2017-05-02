var express = require('express');
var router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/zbrain2db'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Z-Brain Atlas' });
});

router.get('/api/images', (req, res, next) => {
	const results = [];

	pg.connect(connectionString, (err, client, done) => {
		if (err) {
			done()
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
module.exports = router;
