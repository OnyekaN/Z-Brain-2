/* sidebar/sidebar.directive.js */

function sidebarDirective() {
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

export default sidebarDirective;
