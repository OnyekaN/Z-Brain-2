/* lines/lines.service.js */
'use strict'

class LinesService {
	constructor($http) {
		this.$http = $http;
	}

	getAllLineNames() {
		return this.$http.get('api/lines/')
						.then(response => response.data)
						.catch(e => console.log(e));
	}

	getNameOfLine(line) {
		return this.$http.get(`api/lines/nameof/${line}`)
						.then(response => response.data)
						.catch(e => console.log(e));
	}

	getNamesOfLines(options) {

		if ( !options )
			return;

		let [linesPromises, colors, lineNames] = [new Array, new Array, new Object];

		if ( options.red ) {
			linesPromises.push(this.getNameOfLine(options.red));
			colors.push('red');
		}
		if ( options.blue ) {
			linesPromises.push(this.getNameOfLine(options.blue));
			colors.push('blue');
		}
		if ( options.green ) {
			linesPromises.push(this.getNameOfLine(options.green));
			colors.push('green');
		}

		Promise.all(linesPromises).then(values => {
			for ( let i = 0; i < values.length; i++ ) {
				lineNames[colors[i]] = values[i];
			}
		});
		return lineNames;
	}


	getMaskNames() {
		return this.$http.get('api/masks/')
						.then(response => response.data)
						.catch(e => console.log(e));
	}

	getNameOfMask(mask) {
		return this.$http.get(`api/masks/nameof/${mask}`)
						.then(response => response.data)
						.catch(e => console.log(e));
	}

	getNamesOfMasks(options) {

		if ( !options )
			return;

		let [maskPromises, colors, selectedMasks] = [new Array, new Array, new Object];

		if ( options.cyan ) {
			maskPromises.push(this.getNameOfMask(options.cyan));
			colors.push('cyan');
		}
		if ( options.magenta ) {
			maskPromises.push(this.getNameOfMask(options.magenta));
			colors.push('magenta');
		}
		if ( options.green ) {
			maskPromises.push(this.getNameOfMask(options.green));
			colors.push('green');
		}
		if ( options.yellow ) {
			maskPromises.push(this.getNameOfMask(options.yellow));
			colors.push('yellow');
		}

		Promise.all(maskPromises).then(values => {
			for ( let i = 0; i < values.length; i++ ) {
				selectedMasks[colors[i]] = values[i];
			}
		});
		return selectedMasks;
	}

	getAnnotations() {
		return this.$http.get('api/annotations/')
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
				return {'img':img, 'size':obj.mask_image_size};
			});
			return masks;
		})
		.catch(e => console.log(e));
	}

	cacheMultipleMasks(options) {

		if ( !options )
			return;

		let [maskPromises, colors, masks] = [new Array, new Array, new Object];

		if ( options.cyan ) {
			maskPromises.push(this.cacheMask(options.cyan, 'cyan'));
			colors.push('cyan');
		}
		if ( options.magenta ) {
			maskPromises.push(this.cacheMask(options.magenta, 'magenta'));
			colors.push('magenta');
		}
		if ( options.green ) {
			maskPromises.push(this.cacheMask(options.green, 'green'));
			colors.push('green');
		}
		if ( options.yellow ) {
			maskPromises.push(this.cacheMask(options.yellow, 'yellow'));
			colors.push('yellow');
		}

		Promise.all(maskPromises).then(values => {
			for ( let i = 0; i < values.length; i++ ) {
				masks[colors[i]] = values[i].map(obj=>obj.img);
			}
		});
		return masks;
	}

	cacheColorChannel(line, color) {

		return this.getNameOfLine(line).then(name => {
			return this.$http({
						method: 'GET',
						url: `api/colorchannels/{"name":"${name}","color":"${color}"}`,
						cache: true
			}).then(response => {
				let overlays = response.data.map(obj => {
					let img = new Image();
					img.src = obj.channel_image_path;
					return img;
				});
				return overlays;
			}).catch(e => console.log(e));
		});
	}

	cacheMultipleColorChannels(options) {

		if ( !options )
			return;

		let [ccPromises, colors, colorChannels] = [new Array, new Array, new Object];

		if ( options.red ) {
			ccPromises.push(this.cacheColorChannel(options.red, 'red'));
			colors.push('red');
		}
		if ( options.blue ) {
			ccPromises.push(this.cacheColorChannel(options.blue, 'blue'));
			colors.push('blue');
		}
		if ( options.green ) {
			ccPromises.push(this.cacheColorChannel(options.green, 'green'));
			colors.push('green');
		}

		Promise.all(ccPromises).then(values => {
			for ( let i = 0; i < values.length; i++ ) {
				colorChannels[colors[i]] = values[i];
			}
		});
		return colorChannels;
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

