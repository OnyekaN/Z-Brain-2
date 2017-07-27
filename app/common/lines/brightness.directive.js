/* lines/brightness.directive.js */

// directive to use on an input[type=range] for updating image brightness

function zbBrightness() {
	function link(scope, elem, attrs) {
		let oldVal = 10;
		attrs.$observe('zbBrightness', (newVal) => {
			console.log(newVal, oldVal)
			if ( newVal) {	
				Caman("#line-image", function () {
					this.brightness(oldVal-newVal);
				});
			oldVal = newVal;
			}
		});
	}
	return {
		restrict: 'A',
		scope: {
		},
		link: link,

	}
}

export default zbBrightness;
		
