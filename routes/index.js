var express = require('express');
var app = express();
var router = express.Router();
const { Pool } = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/zbrain2db'

const pool = new Pool({
	connectionString: connectionString
});

/* GET home page. */
router.get('/', function(req, res, next) {
	if (app.get('env') === 'development') {
	  res.render('index', { title: 'Z-Brain Atlas',
													main: 'js/main.js' });
	}
	if (app.get('env') === 'production') {
		res.render('index', { title: 'Z-Brain Atlas',
													main: 'js/main.min.js' });
	}
});

/* GET entire imagesdb database as json */
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

/* query db for one line */
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

/* GET single line metadata as json */
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

/* GET mask names */
router.get('/api/masks', (req, res, next) => {
	const results = [];



	pool.connect((err, client, done) => { 
		if (err) {
			done();
			console.log(err);
			res.status(500).json({success: false, data:err});
		}

		querySQL = `SELECT mask_name FROM masks
								GROUP BY mask_name
								ORDER BY mask_name ASC; ` 

		const query = client.query(querySQL);

		query.on('row', (row) => {
			results.push(row);
		});

		query.on('end', () => {
			done();
			res.json(results);
		});
	});

});

/* query db for one mask */
router.param('mask', (req, res, next, id) => {
	const results = [];
	
	pool.connect((err, client, done) => {
		if (err) {
			done();	
			console.log(err);
			return res.status(500).json({success:false, data: err});
		}
		
		querySQL = `SELECT * FROM masks
							WHERE mask_name='${id}'`
		const query = client.query(querySQL);

		query.on('row', (row) => {
			results.push(row);
		});

		query.on('end', () => {
			done();
			req.mask = results;
			return next();
		});
	});		

});

/* GET single mask metadata as json */
router.get('/api/masks/:mask', (req, res, next) => {
	res.json(req.mask);
	return next();
});

/* query db for colorChannel overlay for one line and one color */
router.param('colorchannel', (req, res, next, id) => {
	let channel = JSON.parse(id);
	const results = [];
	
	pool.connect((err, client, done) => {
		if (err) {
			done();	
			console.log(err);
			return res.status(500).json({success:false, data: err});
		}
		
		querySQL = `SELECT * FROM colorChannels
							WHERE channel_name='${channel.name}'
							AND channel_color='${channel.color}';`
		const query = client.query(querySQL);

		query.on('row', (row) => {
			results.push(row);
		});

		query.on('end', () => {
			done();
			req.channel = results;
			return next();
		});
	});		
});

router.get('/api/colorchannels/:colorchannel', (req, res, next) => {
	res.json(req.channel);
});


/* GET python adjusted dataset images */
router.get('/api/adjust/:line', (req, res, next) => {
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
