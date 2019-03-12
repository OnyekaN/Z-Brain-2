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

	res.locals.pool = pool;

	// remove temporary linejpgs if > 6 mins old
	let tmp = path.join(__dirname, '../app/assets/images/1-TemporaryLineImages');
	let result = findRemoveSync(tmp, {age: {seconds: 360}, extensions: ['.jpg', '.jpeg', '.png']	});
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


/* GET metadata for all masks */

router.get('/api/masks', imagesController.get_masks);

router.get('/api/mece-masks', imagesController.get_mece_masks);

/* GET metadata for single mask */
router.param('mask', imagesController.get_mask);

router.param('mecemask', imagesController.get_mece_mask); 

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

module.exports = router;
