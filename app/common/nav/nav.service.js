/* nav/nav.service.js */
'use strict'

class NavService {
	constructor() {
		this.pages = [
			{ name: 'Home', link: '/#/home' },
			{ name: 'About', link: '/#/about' },	
			{ name: 'Contributing to the Z-Brain', link: '/#/contributing' },
			{ name: 'FAQ', link: '/#/faq' },
			{ name: 'Downloads', link: '/#/downloads' },
			{ name: 'Engert Lab Lines Resource', link: 'http://engertlab.fas.harvard.edu:3000/'}
		]
	}
	getActive() {
	}
}
//NavService.$inject = ['$http', '$location']

export default NavService

