var express = require('express');
var app = express();
var router = express.Router();
const path = require('path');
const { Pool } = require('pg');
const c = require('./connectionString').connectionString;
const connectionString = process.env.DATABASE_URL || c;
const findRemoveSync = require('find-remove');
const naturalSort = require('node-natural-sort');
const imagesController = require('./controllers/imagesController');
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

/* GET home page. */

router.get('/', (req, res, next) => {
	if (app.get('env') === 'development') {
	  res.render('index', { title: 'Z Brain Atlas',
													basehref: '/',
													main: 'js/main.js' });
	}
	if (app.get('env') === 'production') {
		res.render('index', { title: 'Z Brain Atlas',
													basehref: '/Z-Brain/',
													main: 'js/main.min.js' });
	}

	// remove temporary linejpgs if > 6 mins old
	let tmp = path.join(__dirname, '../app/assets/images/1-TemporaryLineImages');
	let result = findRemoveSync(tmp, {age: {seconds: 360}, extensions: ['.jpg', '.jpeg', '.png']	});
});

router.get('#', (req, res, next) => {
	res.status(404).send('Not Found');
});
/* GET imagesdb as json */

router.get('/api/imagesdb/', imagesController.get_images);


/* GET metadata for single line */

router.param('line', imagesController.get_line);

router.get('/api/lines/:line', (req, res, next) => {
	res.json(req.line);
});

router.get('/api/lines/nameof/:line', (req, res, next) => {
	if ( req.line.length )
		res.send(req.line[0].line_name);
	else
		res.status(500).send({message: 'Not a database entry'});
});


/* GET metadata for all lines */

router.get('/api/lines', imagesController.get_lines);


/* GET metadata for all regions */

router.get('/api/regions', imagesController.get_regions);


/* GET metadata for single region */

router.param('region', imagesController.get_region);

router.get('/api/regions/:region', (req, res, next) => {
	res.json(req.region);
	return next();
});

router.get('/api/regions/nameof/:region', (req, res, next) => {
	if ( req.region.length )
		res.send(req.region[0].region_name);
	else
		res.status(500).send({message: 'Not a database entry'});
});


/* GET metadata for single color & line colorchannel */

router.param('colorchannel', imagesController.get_color_channel);

router.get('/api/colorchannels/:colorchannel', (req, res, next) => {
	res.json(req.channel);
});


/* GET metadata for all line annotations */

router.get('/api/annotations', imagesController.get_annotations);


/* GET python adjusted dataset images */

router.get('/api/adjust/:line', imagesController.get_adjusted_line);


/* POST user image slices for viewing */

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

/* Catch all other routes and send to app/index.ejs */
router.get('*', function(req, res) {
	if (app.get('env') === 'development') {
	  res.render('index', { title: 'Z Brain Atlas',
													main: 'js/main.js' });
	}
	if (app.get('env') === 'production') {
		res.render('index', { title: 'Z Brain Atlas',
													main: 'js/main.min.js' });
	}
});




module.exports = router;
