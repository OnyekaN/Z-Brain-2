var express = require('express');
var router = express.Router();
var PythonShell = require('python-shell');
const { Pool } = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/zbrain2db'
const pool = new Pool({
	connectionString: connectionString,
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Z-Brain Atlas' });
});

/* GET entire imagesdb database as json*/
router.get('/api/imagesdb', (req, res, next) => {
	const results = [];

	pool.connect((err, client, done) => {
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

	pool.end();

});

/* param for one line */
router.param('line', (req, res, next, id) => {
	const results = [];
	
	pool.connect((err, client, done) => {
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

	pool.connect((err, client, done) => {
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
	let line_name = req.line[0].line_name
	,		image_path = "app/assets/" + req.line[80]["image_path"]
	,		brightness = req.query.brightness
	,		gamma = req.query.gamma
	,		image_paths = ""
	,		image_json = [];

	const spawn = require('child_process').spawn;
	const scriptExecution = spawn('python', ["image_modify.py", line_name, brightness, gamma]);

	const uint8arrayToString = (data) => {
		return String.fromCharCode.apply(null, data);
	}

	scriptExecution.stdout.on('data', (data) => {
		image_paths += (uint8arrayToString(data))	
	});

	scriptExecution.on('exit', (code) => {
		let callback = () => { console.log("Process quit with code : " + code) }
		//setTimeout(callback, 10);
		//
		JSON.parse(image_paths).map(path => {
			let obj = { 'line_name': line_name, 'image_path':	path }
			image_json.push(obj);
		});
		res.json(image_json);
	});

	scriptExecution.stderr.on('data', (data) => {
		let err = uint8arrayToString(data)
//		res.status(500).send(err);
	});



});


module.exports = router;
