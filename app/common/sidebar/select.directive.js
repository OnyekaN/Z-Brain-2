/* sidebar/select.directive.js */

function selectDirective() {
	return {
		restrict: 'A',
		scope: {
		},
		link: function(scope, elem, attrs) {
			$(elem)
				.dropdown({
					fullTextSearch: true
				});
		}
	}
}

export default selectDirective;
