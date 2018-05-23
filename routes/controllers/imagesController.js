

exports.get_images = (req, res, next, pool) => {
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
	return results;
}
