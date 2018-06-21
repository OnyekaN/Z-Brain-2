/* sidebar/select.directive.js */

function select2Directive() {
	return {
		restrict: 'A',
		scope: {
		},
		link: function(scope, elem, attrs) {
			$(elem)
				.select2({
					placeholder: "Search Regions",
					allowClear: true
				});
		}
	}
}

export default select2Directive;
