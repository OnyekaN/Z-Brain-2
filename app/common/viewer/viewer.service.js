/* viewer/viewer.service.js */
'use strict'

class ViewerService {
	constructor() {
	}
	// functions to manually reload the Temporary Line Images as
	// they are produced on the server.
	// Loads them into a non-displayed iframe and relaods the frame,
	// which refreshes browser cache and clears the initially empty
	// versions of those images
	imgReloadRestore(image, imgDim, loadError) {
		let i, img, { height, width } = imgDim;

		img = image;
		img.src = image.src;
		if ( width ) img.style.width = width + "px";
		if ( height ) img.style.height = height + "px";
		
	}

	forceImgReload(image, isCrossDomain, imgDim, twostage) {
		let blankList, step = 0,
				iframe = window.document.createElement("iframe"),
				loadCallback = (e) => {
					if ( !step ) {
						if ( twostage ) { 
							step = 1 
						} else { 
							step = 2; 
							iframe.contentWindow.location.reload(true); 
						}
					}
					else if ( step === 2 ) {
						this.imgReloadRestore(image, imgDim, (e||window.event).type==="error");
						if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
					}
				}
		iframe.style.display = "none";
		window.parent.document.body.appendChild(iframe);
		iframe.addEventListener("load", loadCallback, false);
		iframe.addEventListener("error", loadCallback, false);
		iframe.src = image.src;
		return (twostage ?
			(proceed, dim) => {
				if (!twostage) return;
				twostage = false;
				if (proceed) {
					imgDim = (dim||imgDim);
					if (step===1) { step = 2; iframe.contentWindow.location.reload(true); }
				} else {
					step = 3;
					if (iframe.contentWindow.stop) iframe.contentWindow.stop();
					if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
				}
			}
		: null);
	}
						
}

export default ViewerService;




