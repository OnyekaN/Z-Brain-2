/* lines/lines.service.js */
'use strict'

class LinesService {
	constructor($http) {
		this.$http = $http;
	}

	getLineNames() {
		return this.$http.get('/api/lines/')
						.then(response => response.data)
						.catch(e => console.log(e));
	}

	cacheLine(line) {
		return this.$http({
						method: 'GET',
						url: `/api/lines/${line}`,
						cache: true
		}).then(response => {
			let images = response.data.map(obj => {
				let img = new Image(); img.src = obj.image_path; return img
			});
			return images;
		})
		.catch(e => console.log(e));
	}

	modifyLine(line, brightness, gamma) {
		return this.$http({
						method: 'GET',
						url: `/api/caman/${line}?brightness=${brightness}&gamma=${gamma}`,
						cache: true
		}).then(response => {
			return response;
		})
	.catch(e => console.log(e));
	}

}

LinesService.$inject = ['$http'];

export default LinesService;

