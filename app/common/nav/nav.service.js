/* nav/nav.service.js */
'use strict'

class NavService {
	constructor() {
		this.pages = [
			{ name: 'Home', link: '#/home' },
			{ name: 'About', link: '#/about' },
			{ name: 'Contributing to the Z-Brain', link: '#/contributing' },
			{ name: 'FAQ', link: '#/faq' },
			{ name: 'Downloads', link: '#/downloads' },
			{ name: 'Multiscale Virtual Fish', link: 'http://www.zib.de/projects/multiscale-virtual-fish'},
			{ name: 'Engert Lab Lines Resource', link: 'http://engertlab.fas.harvard.edu/Enhancer-Trap/'},
			{ name: 'Upload (Beta)', link: '#/upload' }
		]
	}
	getActive() {
	}
}
//NavService.$inject = ['$http', '$location']

export default NavService

