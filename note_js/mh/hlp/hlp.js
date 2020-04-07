module.exports = (function () {
	"use strict";
	const DATE_FORMAT=[
		{weekday:'short',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'},
		{weekday:'long',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'},
		{year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'},
		{year:'numeric',month:'numeric',day:'numeric'}];
	let getDate=()=>{ return Date() };
	let getFormatDate=(x,a)=>{ return new Date(x).toLocaleDateString('de-DE',DATE_FORMAT[a]) };
	let getFormat=()=>{ return DATE_FORMAT };
	let getError=(err)=>{
		if (err instanceof Error) {
			let msg = err.message;
			let error = { art:'Error', msg:msg };
			return JSON.stringify(JSON.stringify(error));
		}
		else {
			return err;
		}
	};

	return{getDate,getFormatDate,getFormat,getError}

} ) ();
