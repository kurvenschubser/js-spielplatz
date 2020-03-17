/*
Fitness Stammdaten DAO
*/
"use strict";
let dao=(function(){	
	let artDao=(function(){
		//constructor(id,name,desc){super(id,name,desc)
		let lst=[];
		async function fillLst(){
			fetch(`${ini.CONFOBJ.url}&a=0&ac=0`).then(
			function(response) {			  
			  response.text().then(function(text) {
				if(text.startsWith("<p><b>ACHTUNG")){
					cont.setError(text);
					return;
				}
				let doc=JSON.parse(JSON.parse(text));
				//Liste füllen
				//console.log(JSON.parse(doc));
				let lstart =doc.DB.lst_f_arten;
				let ge =null;
				for (let key in lstart) {
					let obj = lstart[key];
					for (let skey in obj) {
						let sobj = obj[skey];
						ge = new dom.f_arten(sobj._attributes.id,sobj.name._text,sobj.desc._text);				
						lst.push(ge);				
					}
				}						
			  },
			  function(err){cont.setError(err)}
			)});
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getById=(nr)=>{for (let key of dao.artDao.getList()) {if(key.Id === nr){return key;break;}}}		
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();
	let egDao=(function(){
		//constructor(id,name,desc,farbe,sort)
		let lst=[];
		async function fillLst(){
			fetch(`${ini.CONFOBJ.url}&a=1&ac=0`).then(
			function(response) {
			  response.text().then(function(text) {
				if(text.startsWith("<p><b>ACHTUNG")){
					cont.setError(text);
					return;
				}
				let doc=JSON.parse(JSON.parse(text));
				//Liste füllen			
				let lstEg= doc.DB.lst_f_eigenschaft;
				let ge =null;
				for (let key in lstEg) {				
					let obj = lstEg[key];
					for (let skey in obj) {
						let sobj = obj[skey];
						let cl= hlp.rgb2hex(sobj.farbe._attributes.r,sobj.farbe._attributes.g,sobj.farbe._attributes.b);
						ge = new dom.f_eigenschaft(sobj._attributes.id,sobj.name._text,sobj.desc._text,cl,sobj._attributes.sort);				
						lst.push(ge);
					}							
				}			
				let lstart =doc.DB.lst_f_arten;					
			  },
			  function(err){cont.setError(err)}
			)});
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getById=(nr)=>{for (let key of dao.egDao.getList()) if(key.Id === nr){return key;break;}}
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();
	let gerDao=(function(){
		//constructor(id,name,desc,art,bild)
		let lst=[];
		async function fillLst(){
			fetch(`${ini.CONFOBJ.url}&a=2&ac=0`).then(
			function(response) {
			  response.text().then(function(text) {
				if(text.startsWith("<p><b>ACHTUNG")){
					cont.setError(text);
					return;
				}
				let doc=JSON.parse(JSON.parse(text));
				//Liste füllen						
				let lstGer= doc.DB.lst_f_geraete;
				let ge =null;
				for (let key in lstGer) {
					let obj = lstGer[key];
					for (let skey in obj) {
						let sobj = obj[skey];
						ge = new dom.f_geraete(sobj._attributes.id,sobj.name._text,sobj.desc._text,sobj._attributes.art,sobj.bild._text);			
						lst.push(ge);
					}
				}			
			  },
			  function(err){cont.setError(err)}
			)});
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getLstByArt=(nr)=>{			
			let nLst=[];
			for (let key of getList()) {if(key.Art === nr)nLst.push(key)};
			return nLst;
		}
		let getById=(nr)=>{for (let key of dao.gerDao.getList()) if(key.Id === nr){return key;break;}}
		return {getList: getList,getById: getById,getLstByArt: getLstByArt,fillLst:fillLst};
	})();
		
	return {artDao: artDao,gerDao: gerDao,egDao: egDao}; 
})();