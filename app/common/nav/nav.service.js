/* nav/nav.service.js */
'use strict'

class NavService {
	constructor() {
		this.pages = [
			{ name: 'Home', link: '/#/home' },
			{ name: 'About', link: '/#/about' },	
			{ name: 'Contributing to the Z-Brain', link: '#' },
			{ name: 'FAQ', link: '#' },
			{ name: 'Downloads', link: '#' },
			{ name: 'Engert Lab Lines Resource', link: '#'}
		]
	}
	getActive() {
	}
}
//NavService.$inject = ['$http', '$location']

export default NavService

