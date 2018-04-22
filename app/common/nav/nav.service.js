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
			{ name: 'Zebrafish EM', link: 'http://hildebrand16.neurodata.io/catmaid/?pid=6&zp=537540&yp=351910.65&xp=303051.45&tool=tracingtool&sg=2&sgs=4' },
			{ name: 'Multiscale Virtual Fish', link: 'http://www.zib.de/projects/multiscale-virtual-fish'},
			{ name: 'Enhancer-Trap Lines', link: 'http://engertlab.fas.harvard.edu/Enhancer-Trap/'},
		]
	}
	getActive() {
	}
}
//NavService.$inject = ['$http', '$location']

export default NavService

