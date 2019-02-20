var express = require('express');
var app = express();
var router = express.Router();
const { Pool } = require('pg');
const path = require('path');
const c = require('./connectionString').connectionString;
const imagesController = require('./controllers/imagesController');
const connectionString = process.env.DATABASE_URL || c;
const findRemoveSync = require('find-remove');
const naturalSort = require('node-natural-sort');
const multer = require('multer');
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './app/assets/images/1-TemporaryLineImages')
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	}
});
const upload = multer({
	storage: storage,
	fileFilter: (req, file, callback) => {
		let ext = path.extname(file.originalname);
		if ( ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
				return callback(new Error('Only images are allowed'));
			}
			callback(null, true)
	},
});
const pool = new Pool({
	connectionString: connectionString
});

/* GET home page. */
router.get('/', function(req, res, next) {
	if (app.get('env') === 'development') {
	  res.render('index', { title: 'Z Brain Atlas',
													main: 'js/main.js' });
	}
	if (app.get('env') === 'production') {
		res.render('index', { title: 'Z Brain Atlas',
													main: 'js/main.min.js' });
	}

	// remove temporary linejpgs if > 6 mins old
	let tmp = path.join(__dirname, '../app/assets/images/1-TemporaryLineImages');
	let result = findRemoveSync(tmp, {age: {seconds: 360}, extensions: ['.jpg', '.jpeg', '.png']});
});

/* GET entire imagesdb database as json */
router.get('/api/imagesdb', (req, res, next) => {
	let results = [];

	pool.connect((err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		let query = client.query('SELECT * FROM images ORDER BY image_id ASC;');

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


router.param('line', (req, res, next, id) => {
	let results = [];

	pool.connect((err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success:false, data: err});
		}

		let querySQL;

		if ( isNaN(id) ) {
			querySQL = `SELECT * FROM images
								WHERE line_name='${id}'`
		} else {
			querySQL = `SELECT * FROM images
								WHERE line_id='${id}'`
		}

		let query = client.query(querySQL);

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

router.get('/api/lines/nameof/:line', (req, res, next) => {
	if ( req.line.length )
		res.send(req.line[0].line_name);
	else
		res.status(500).send({message: 'Not a database entry'});
});

router.get('/api/lines', (req, res, next) => {
	let results = []

	pool.connect((err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		let querySQL = `SELECT line_name, line_id FROM images
								GROUP BY line_name, line_id
								ORDER BY line_name ASC; `

		let [ query, index ] = [ client.query(querySQL), 1	];

		query.on('row', (row) => {
			row['id'] = index++;
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
	let results = [];

	pool.connect((err, client, done) => {
		if (err) {
			done();
			console.log(err);
			res.status(500).json({success: false, data:err});
		}

		querySQL = `SELECT mask_name, mask_id FROM masks
								GROUP BY mask_name, mask_id
								ORDER BY mask_name ASC; `

		let [ query, index ] = [ client.query(querySQL), 1001 ];
		query.on('row', (row) => {
			results.push(row);
		});

		query.on('end', () => {
			done();
			res.json(results);
		});
	});

});

router.get('/api/mece', (req, res, next) => {
	let results = [];

	pool.connect((err, client, done) => {
		if (err) {
			done();
			console.log(err);
			res.status(500).json({success: false, data:err});
		}

		querySQL = `SELECT mask_name, mask_id FROM meceMasks
								GROUP BY mask_name, mask_id
								ORDER BY mask_name ASC; `

		let [ query, index ] = [ client.query(querySQL), 1001 ];
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
	let results = [];

	pool.connect((err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		let querySQL;

		if ( isNaN(id) ) {
			querySQL = `SELECT * FROM masks
									WHERE mask_name='${id}'
									ORDER BY mask_img_id;`
		} else {
			querySQL = `SELECT * FROM masks
									WHERE mask_id='${id}'
									ORDER BY mask_img_id;`
		}

		let query = client.query(querySQL);

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

router.param('mecemask', (req, res, next, id) => {
	let results = [];

	pool.connect((err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		let querySQL;

		if ( isNaN(id) ) {
			querySQL = `SELECT * FROM meceMasks
									WHERE mask_name='${id}'
									ORDER BY mask_img_id;`
		} else {
			querySQL = `SELECT * FROM meceMasks
									WHERE mask_id='${id}'
									ORDER BY mask_img_id;`
		}

		let query = client.query(querySQL);

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

router.get('/api/mece/:mecemask', (req, res, next) => {
	res.json(req.mask);
	return next();
});

router.get('/api/masks/nameof/:mask', (req, res, next) => {
	if ( req.mask.length )
		res.send(req.mask[0].mask_name);
	else
		res.status(500).send({message: 'Not a database entry'});
});


/* query db for colorChannel overlay for one line and one color */
router.param('colorchannel', (req, res, next, id) => {
	let channel = JSON.parse(id);
	let results = [];

	pool.connect((err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		let querySQL = `SELECT * FROM colorChannels
									WHERE channel_name='${channel.name}'
									AND channel_color='${channel.color}';`

		let query = client.query(querySQL);

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

router.get('/api/annotations', (req, res, next) => {
	let results = [];
	pool.connect((err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		let querySQL = 'SELECT * FROM annotations ORDER BY line_id;';
		let query = client.query(querySQL);

		query.on('row', (row) => {
			results.push(row);
		});

		query.on('end', () => {
			done();
			let annotations = {};
			results.forEach(line => {
				annotations[line.line_name] = line;
			});
			return res.json(annotations);
		});
	});

});


/* GET python adjusted dataset images */
router.get('/api/adjust/:line', (req, res, next) => {
	let line_name = req.line[0].line_name
	,		brightness = req.query.brightness
	,		gamma = req.query.gamma
	,		slice = req.query.slice
	,		image_paths = ""
	,		image_json = [];

	let spawn = require('child_process').spawn
	,		scriptPathInitial = path.join(__dirname, '../initial_slices.py')
	,		scriptExecution = spawn('python', ['-W', 'ignore', scriptPathInitial, line_name, brightness, gamma, slice])
	,		scriptPathRemaining = path.join(__dirname, '../remaining_slices.py')
	,		scriptExecutionFinal = spawn('python', ['-W', 'ignore', scriptPathRemaining, line_name, brightness, gamma, slice])

	let uint8arrayToString = (data) => {
		return String.fromCharCode.apply(null, data);
	}

	scriptExecution.stdout.on('data', (data) => {
		image_paths += (uint8arrayToString(data))
	});

	scriptExecution.on('exit', (code) => {
		let callback = () => { console.log("Process quit with code : " + code) }

		JSON.parse(image_paths).map(path => {
			let obj = { 'line_name': line_name, 'image_path':	path }
			image_json.push(obj);
		});
		res.json(image_json);
	});

	scriptExecution.stderr.on('data', (data) => {
		let err = uint8arrayToString(data)
		res.status(500).send(err);
	});

});

// Upload image slices or tiff stacks for viewing
router.post('/api/upload', upload.array('files', 138), (req, res, next) => {

	// remove temporary linejpgs/pngs if > 30s old
	let tmp = path.join(__dirname, '../app/assets/images/1-TemporaryLineImages');
	let result = findRemoveSync(tmp, {age: {seconds: 30}, extensions: ['.jpg', '.jpeg', '.png']});

	let files = req.files.map(file => {
		return file.path.replace('app/assets/', '');
	})
	files = files.sort(naturalSort());
	res.json(files);

});



module.exports = router;
