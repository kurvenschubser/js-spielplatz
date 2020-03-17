"use strict";
let ini=(function(){
/*##################################################################*/
	/*hier entscheiden welches Program verwendet werden soll*/
	/*Programm: 0 = Fitness 1 = Programmierhilfe*/
	const PRO=0;
	/*hier entscheiden welcher Speicher verwendet werden soll*/	
	/*Speicher: store 0 = Dao 1 = Xml 2 = MySql 3 = MsSql 4 = LowDb*/	
	const STORE=4;	
/*##################################################################*/		
	/*Liste der Programme*/
	const LST_CONFOBJ=[
	{id:0,titel:"Fitness - Stammdaten",v:"0.9.0.0",stor:{}},
	{id:1,titel:"Programmierhilfe - Stammdaten",v:"0.9.0.1",stor:{}}];	
	/*Liste der Speichermöglichkeiten*/
	const LST_STORE=[
	{id:0,art:"Lok",desc:"Datenbank: Lokal",v:"1"},
	{id:1,art:"Xml",desc:"Datenbank: XML",v:"1"},
	{id:2,art:"MySql",desc:"Datenbank: MySql",v:"1"},
	{id:3,art:"MsSql",desc:"Datenbank: MsSql",v:"1"},
	{id:4,art:"Ldb",desc:"Datenbank: LowDb",v:"1"}];	
	/*Globales*/
	const CONFOBJ=LST_CONFOBJ[PRO];
	CONFOBJ.stor=LST_STORE[STORE];
	CONFOBJ.url=`http://localhost:8888/?p=${PRO}&s=${STORE}`;
	let init=()=>{
		"use strict";		
		// IE11-support
		String.prototype.startsWith || (String.prototype.startsWith= function(s) { let n= s.length; return n<=this.length && this.substring(0,n)===s });
		String.prototype.endsWith || (String.prototype.endsWith= function(s) { let n= this.length-s.length; return n>=0 && this.substring(n)===s });	
		try{
			let scrptOb={art:'script',src:"./lib/hlp.js",type:"text/javascript",charset:"utf-8"};
			setScript(scrptOb);	
			scrptOb.src=`./lib/lib_${CONFOBJ.id}/domain.js`;
			setScript(scrptOb);	
			scrptOb.src=`./lib/lib_${CONFOBJ.id}/dao${CONFOBJ.stor.art}.js`;
			setScript(scrptOb);
			scrptOb.src="./lib/view_h.js";
			setScript(scrptOb);		
			scrptOb.src="./lib/view.js";
			setScript(scrptOb);				
			scrptOb.src=`./lib/lib_${CONFOBJ.id}/ctrl.js`;
			setScript(scrptOb);
			scrptOb={art:'link',src:"css/index.css",type:"stylesheet",charset:"utf-8"};
			setScript(scrptOb);	
			document.title=CONFOBJ.titel;
		}
		catch (e) {console.log(e)}
	}
	let setScript=(scrptOb)=>{
		try{
			if(document.readyState==="complete") {				
				let scr= document.createElement(scrptOb.art);
				if(scrptOb.art==='script') {scr.src= scrptOb.src;scr.type= scrptOb.type;scr.charset= scrptOb.charset;}
				else if(scrptOb.art==='link') {scr.href= scrptOb.src;scr.rel= scrptOb.type;}
				document.head.appendChild(scr);		
			}
			else {			
				let sr=''
				if(scrptOb.art==='script') sr = `<script src='${scrptOb.src}' type='${scrptOb.type}' charset='${scrptOb.charset}'><\/script>`;					
				else if(scrptOb.art==='link') sr = `<link rel='${scrptOb.type}' href='${scrptOb.src}' /><\/link>`;					
				document.write(sr);		
			}
		}
		catch (e) {throw e}
	}	
	return {CONFOBJ:CONFOBJ,init:init};
})();
