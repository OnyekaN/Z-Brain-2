/* lines/lines.directive.js */

function linesDirective() {
	return {
		restrict: 'A',
		scope: {
		},
		link: function(scope, elem, attrs) {
			$(elem)
				.dropdown()
			;
		}
	}
}

export default linesDirective;
