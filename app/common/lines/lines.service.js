/* lines/lines.service.js */
'use strict'

class LinesService {
	constructor($http) {
		this.$http = $http;
	}

	getLineNames() {
		return this.$http.get('api/lines/')
						.then(response => response.data)
						.catch(e => console.log(e));
	}

	getMaskNames() {
		return this.$http.get('api/masks/')
						.then(response => response.data)
						.catch(e => console.log(e));
	}

	cacheLine(line) {
		return this.$http({
						method: 'GET',
						url: `api/lines/${line}`,
						cache: true
		}).then(response => {
			let images = response.data.map(obj => {
				let img = new Image(); img.src = `images/0-Lines/${obj.image_path}`;
			 	return img;
			});
			return images;
		})
		.catch(e => console.log(e));
	}

	cacheMask(mask, color) {
		return this.$http({
						method: 'GET',
						url: `api/masks/${mask}`,
						cache: true
		}).then(response => {
			let masks = response.data.map(obj => {
				let img = new Image(); 
				img.src = `images/2-Masks/${color}/${obj.mask_image_path}`;
				return img;
			});
			return masks;
		})
		.catch(e => console.log(e));
	}

	cacheColorChannel(line, color) {
		return this.$http({
						method: 'GET',
						url: `api/colorchannels/{"name":"${line}","color":"${color}"}`,
						cache: true
		}).then(response => {
			let overlays = response.data.map(obj => {
				let img = new Image();
				img.src = obj.channel_image_path;
				return img;
			});
			return overlays;
		}).catch(e => console.log(e));
	}

	adjustLine(line, brightness, gamma, slice) {
		return this.$http({
						method: 'GET',
						url: `api/adjust/${line}?brightness=${brightness}&gamma=${gamma}&slice=${slice}`,
						cache: true
		}).then(response => {
			let images = response.data.map(obj => {
				let img = new Image();
				let date = new Date().getTime()
				img.src = obj.image_path; 
				return img;
			});
			return images;
		})
	.catch(e => console.log(e));
	}

}

LinesService.$inject = ['$http'];

export default LinesService;

