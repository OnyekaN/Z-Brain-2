'use strict'


class linesController {
	constructor(pgPool) {

		this.pgPool = pgPool;
		this.get_line = this.get_line.bind(this);
	}

	get_line(id) {

		let results = [];
		this.pgPool.connect((err, client, done) => {

			if ( err ) {
				done();
				console.log(err);
				return res.status(500).json({success: false, data: err});
			}

			let querySQL = `SELECT * FROM images WHERE line_name='${id}'`;
			const query = client.query(querySQL);

			query.on('row', (row) => {
				results.push(row);
			});

			query.on('end', () => {
      	done();
				this.pgPool.end();
				return results;
    	});

  	});
	}

}

module.exports = linesController;
