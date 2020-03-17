"use strict";
exports.hlp=(function(){
	const DATE_FORMAT=[
		{weekday:'short',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'},
		{weekday:'long',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'},
		{year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'},
		{year:'numeric',month:'numeric',day:'numeric'}];
	let getDate=()=>{return Date()};
	let getFormatDate=(x,a)=>{return new Date(x).toLocaleDateString('de-DE',DATE_FORMAT[a])};
	let getFormat=()=>{return DATE_FORMAT};
	let getError=(err)=>{
		if(err instanceof EvalError){}
		else if(err instanceof EvalError){}
		else if(err instanceof InternalError){}
		else if(err instanceof ReferenceError){}
		else if(err instanceof SyntaxError){}
		else if(err instanceof TypeError){}
		else if(err instanceof URIError){}
		else{}
		return err
	}
	return{getDate:getDate,getFormatDate:getFormatDate,getFormat:getFormat,getError:getError}

})();
