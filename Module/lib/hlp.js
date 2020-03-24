let hlp=(function () {
	"use strict";
	const DATE_FORMAT=[
		{weekday:'short',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'},
		{weekday:'long',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'},
		{year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'},
		{year:'numeric',month:'numeric',day:'numeric'}];

	let rgb2hex = (red, green, blue) => {
        let rgb = blue | (green << 8) | (red << 16);
        return '#' + (0x1000000 + rgb).toString(16).slice(1)
	}

	let hex2rgb = (hex) => {
        // long version
        let r = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        if (r) return r.slice(1,4).map(function(x) { return parseInt(x, 16); });
        // short version
        r = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
        if (r) return r.slice(1,4).map(function(x) { return 0x11 * parseInt(x, 16); });
	}

	let isInt = (val) => {let er = /^-?[0-9]+$/;return er.test(val);}

	let isFileApi = () => ((window.File && window.FileReader && window.FileList && window.Blob)?true:false);

	let getDate = (x,art) => new Date(x).toLocaleDateString('de-DE',DATE_FORMAT[art]);

	return {getDate,isFileApi,isInt,hex2rgb,rgb2hex};
})();
