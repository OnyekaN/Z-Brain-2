var express = require('express');
var router = express.Router();
var Caman = require('caman').Caman;
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
router.get('/api/lines/:line', (req, res, next) => {
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

/* GET caman-modified dataset images */
router.get('/api/caman/:line', (req, res, next) => {
	let line_name= req.line[0].line_name;
	let line_qty = 138;
	let image_path = "app/assets/" + req.line[80]["image_path"];
	let brightness = req.query.brightness;
	let gamma = req.query.gamma;
	let modified_images = [];

	for (i = 0; i < line_qty; i++) {
		let orig_image_path = `app/assets/${req.line[i].image_path}`;
		let rel_new_image_path = `images/1TemporaryLineImages/${line_name}&b${brightness}&g${gamma}-${i}.png`;
		let abs_new_image_path = `app/assets/${rel_new_image_path}`;
		modified_images.push({'line_name': line_name, 'image_path': rel_new_image_path});

		Caman(orig_image_path, function () {
			this.revert(false)
			this.brightness(brightness);
			this.gamma(gamma);
			this.render(function () {
				this.save(abs_new_image_path);
			});
		});
	}
	/*
	Caman(image_path, function () {
		this.revert(false);
		this.brightness(brightness);
		this.gamma(gamma);
		this.render(function () {
			this.save("app/assets/images/1test/test1.png");
		});
	});*/
	res.json(modified_images);


});


module.exports = router;
