
const AppType = {
	Fitness: 0,
	Programmierhilfe: 1
};
const StorageType = {
	Dao: 0,
	Xml: 1,
	MySql: 2,
	MsSql: 3,
	LowDb: 4
};
"use strict";
let ini=(function(app = AppType.Fitness, storage = StorageType.LowDb){
/*##################################################################*/
	/*hier entscheiden welches Program verwendet werden soll*/
	/*Programm: 0 = Fitness 1 = Programmierhilfe*/
	const PRO=app;
	/*hier entscheiden welcher Speicher verwendet werden soll*/
	/*Speicher: store 0 = Dao 1 = Xml 2 = MySql 3 = MsSql 4 = LowDb*/
	const STORE=storage;
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
	//URL für cypress
	//CONFOBJ.url=`/api/?p=${PRO}&s=${STORE}`;
	//URL für Seite
	CONFOBJ.url=`http://localhost:8888/?p=${PRO}&s=${STORE}`;

	let setHeight=()=>{
		let el=document.getElementsByTagName("main")[0];
		if (el) {
			let style = getComputedStyle(el);
			const w=parseInt(window.innerWidth);
			if (w < 980) {
				el.style.gridTemplateColumns ="100%";
				el.style.gridTemplateRows = "minmax(40px, auto) 40px 40px 200px 40px auto minmax(40px, auto)";

			}
			else{
				el.style.gridTemplateColumns = "20% 79%";
				el.style.gridTemplateRows = "80px 40px 780px 40px";
			}
		}
	}

	let init=()=>{
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
			window.addEventListener('resize', setHeight);
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

	return {CONFOBJ,init};
})();
