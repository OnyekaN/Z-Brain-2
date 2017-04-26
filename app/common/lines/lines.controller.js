/* lines/lines.controller.js */

class LinesController {
	constructor() {
	//	this.lines = LinesService.lines;
		this.itemArray = [
			{id: 1, name: 'first'},
			{id: 2, name: 'second'},
			{id: 3, name: 'thirdwithanamelongerthantheddadgagdadgadgabox'}
		]
		this.selected = { value: this.itemArray[0] };
		this.selectedItem = "";
	}
}

//LinesController.$inject['LinesService'];

export default LinesController;
