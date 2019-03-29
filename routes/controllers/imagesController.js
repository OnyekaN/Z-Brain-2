const path = require('path');
const { Pool } = require('pg');
const c = require('../connectionString').connectionString;
const connectionString = process.env.DATABASE_URL || c;

// GET entire imagesdb database
exports.get_images = (req, res, next) => {
	let results = [];
	let pool = new Pool({ connectionString: connectionString });
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
	return results;
}

// GET single line from lines table
exports.get_line = (req, res, next, id) => {
	let results = [];
	let pool = new Pool({ connectionString: connectionString });
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
}

exports.get_lines = (req, res, next) => {
	let pool = new Pool({ connectionString: connectionString }),
			results = [];

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
}


// GET all masks from masks table
exports.get_masks = (req, res, next) => {
	let pool = new Pool({ connectionString: connectionString }),
			results = [];

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
}

// GET all MECE masks from meceMasks table
exports.get_mece_masks = (req, res, next) => {
	let pool = new Pool({ connectionString: connectionString }),
			results = [];

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
}

// GET single mask from masks table
exports.get_mask = (req, res, next, id) => {
	let pool = new Pool({ connectionString: connectionString }),
			results = [];

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
}

// GET single mask from meceMasks Table
exports.get_mece_mask = (req, res, next, id) => {
	let pool = new Pool({ connectionString: connectionString }),
			results = [];	

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
}

// GET single color channel from meceMasks Table
exports.get_color_channel = (req, res, next, id) => {
	let pool = new Pool({ connectionString: connectionString }),
			channel = JSON.parse(id),
			results = [];	

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
}


// GET annotations for all lines
exports.get_annotations = (req, res, next) => {
	let pool = new Pool({ connectionString: connectionString }),
			results = [];

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
}

// GET python adjusted line images
exports.get_adjusted_line = (req, res, next) => {
	let line_name = req.line[0].line_name
	,		brightness = req.query.brightness
	,		gamma = req.query.gamma
	,		slice = req.query.slice
	,		image_paths = ""
	,		image_json = [];

	let spawn = require('child_process').spawn
	,		scriptPathInitial = path.join(__dirname, '../../scripts/initial_slices.py')
	,		scriptExecution = spawn('python', ['-W', 'ignore', scriptPathInitial, line_name, brightness, gamma, slice])
	,		scriptPathRemaining = path.join(__dirname, '../../scripts/remaining_slices.py')
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
}

// POST line images
// use with 'Multer',
// e.g. router.post('/api/post', upload.array('files', 138), controller.post_line);
exports.post_line = (req, res, next) => {

	// Remove temporary linejpgs/pngs if > 30s old
	
	let tmp = path.join(__dirname, '../../app/assets/images/1-TemporaryLineImages');
	let result = findRemoveSync(tmp, {age: {seconds: 30}, extensions: ['.jpg', '.jpeg', '.png']});

	let files = req.files.map(file => {
		return file.path.replace('app/assets/', '');
	})
	files = files.sort(naturalSort());
	res.json(files);
}

