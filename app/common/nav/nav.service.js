/* nav/nav.service.js */
'use strict'

class NavService {
	constructor() {
		this.pages = [
			{ name: 'Home', active: false, link: './home', target: '' },
			{ name: 'About', active: false, link: './about', target: ''  },
			{ name: 'Contributing to the Z Brain', active: false, link: './contributing', target: '' },
			{ name: 'Downloads', active: false, link: './download', target: ''  },
			{ name: 'FAQ', active: false, link: './faq', target: ''  },
			{ name: 'ZIB Vis Explorer', active: false, link: 'https://visual.zib.de/2018/zebrafish/visexplorer/', target: '_blank'},
			{ name: 'Zebrafish EM', active: false, link: 'http://hildebrand16.neurodata.io/catmaid/?pid=6&zp=537540&yp=351910.65&xp=303051.45&tool=tracingtool&sg=2&sgs=4', target: '_blank' },
			{ name: 'Enhancer Trap Lines Explorer', active: false, link: 'http://engertlab.fas.harvard.edu/Enhancer-Trap/', target: '_blank'},
		]
	}
	getActive() {
	}
}


export default NavService;

