/* nav/nav.controller.js */
'use strict'

class NavController {
	constructor(NavService) {
		this.pages = NavService.pages;
	}
}

NavController.$inject = ['NavService'];

export default NavController;
