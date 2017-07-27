/* lines/slider-directive.js */

function sliderDirective() {
	return {
		restrict: 'A',
		scope: {
		},
		link: function(scope, elem, attrs) {
			$(elem)
				.slider();
		},
	}
}

export default sliderDirective;


