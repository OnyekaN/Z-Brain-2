/* nav/nav.controller.js */
'use strict'

class NavController {
	constructor($location, NavService) {
		this.$location = $location;
		this.pages = NavService.pages;
	}
	$onInit() {
		let link = this.$location.path();
		this.updateNav(link);
	}
	updateNav(link) {
		let page = link.split('/')[1]
		if ( page === "" )
			return;
		for ( let i = 0; i < this.pages.length; i++ ) {
			if ( this.pages[i].link.indexOf(page) != -1 )
				this.pages[i].active = true;
			else
				this.pages[i].active = false;
		}
	}
}

NavController.$inject = ['$location', 'NavService'];

export default NavController;
