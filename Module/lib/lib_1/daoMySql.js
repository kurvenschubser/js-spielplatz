/*
Programmierhilfe Stammdaten DAO
*/
"use strict";
let dao=(function(){
	let sprDao=(function(){
		//f_sprache constructor(id,name,desc,date,edit)
		var lst=[];
		async function fillLst(){			
			fetch(`${ini.CONFOBJ.url}&a=0&ac=0`).then(
			  function(response) {
			  response.text().then(function(text) {
				if(text.startsWith("<p><b>ACHTUNG")){
					cont.setError(text);
					return;
				}
				var doc=JSON.parse(text);
				//Liste füllen
				let lstSpr= doc.DB.lst_f_sprache;
				let ge =null;
				for (var key in lstSpr) {				
					var obj = lstSpr[key];
					for (var skey in obj) {
						var sobj = obj[skey];					
						ge = new dom.f_sprache(sobj._attributes.id,sobj.name._text,sobj.desc._text,sobj.date._text,sobj.edit._text);				
						lst.push(ge);
					}							
				}									
			  },function(err){cont.setError(text)})
			});
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}		
		let getById=(nr)=>{
			for (let key of dao.sprDao.getList())			
				if(key.Id === nr){return key;break;}
		}		
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();
	let subsprDao=(function(){
		//f_sprache constructor(id,name,desc,date,edit)
		var lst=[];
		async function fillLst(){			
			fetch(`${ini.CONFOBJ.url}&a=1&ac=0`).then(
			  function(response) {
			  response.text().then(function(text) {
				if(text.startsWith("<p><b>ACHTUNG")){
					cont.setError(text);
					return;
				}
				var doc=JSON.parse(text);
				//Liste füllen
				let lstSpr= doc.DB.lst_f_sprache;
				let ge =null;
				for (var key in lstSpr) {				
					var obj = lstSpr[key];
					for (var skey in obj) {
						var sobj = obj[skey];					
						ge = new dom.f_sprache(sobj._attributes.id,sobj.name._text,sobj.desc._text,sobj.date._text,sobj.edit._text);				
						lst.push(ge);
					}							
				}									
			  },function(err){cont.setError(text)})
			});
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}		
		let getById=(nr)=>{
			for (let key of dao.sprDao.getList())			
				if(key.Id === nr){return key;break;}
		}		
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();
	let temDao=(function(){
		//f_thema constructor(id,name,desc,date,edit)
		var lst=[];
		async function fillLst(){
			fetch(`${ini.CONFOBJ.url}&a=2&ac=0`).then(		  
			  function(response) {
			  response.text().then(function(text) {				
				if(text.startsWith("<p><b>ACHTUNG")){
					cont.setError(text);
					return;
				}
				var doc=JSON.parse(text);
				//Liste füllen			
				let lstThema =doc.DB.lst_f_thema;
				let ge =null;
				for (var key in lstThema) {
					var obj = lstThema[key];
					for (var skey in obj) {
						var sobj = obj[skey];
						ge = new dom.f_thema(sobj._attributes.id,sobj.name._text,sobj.desc._text,sobj.date._text,sobj.edit._text);				
						lst.push(ge);			
					}
				}						
			  },function(err){cont.setError(text)})
			});
		}			
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getById=(nr)=>{
			for (let key of dao.temDao.getList())
				if(key.Id === nr){return key;break;}
		}
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();
	let einDao=(function(){
		//f_eintrag constructor(id,name,desc,val,thema,spr,date,edit)
		var lst=[];		
		async function fillLst(){
			fetch(`${ini.CONFOBJ.url}&a=3&ac=0`).then(
			  function(response) {
			  response.text().then(function(text) {
				if(text.startsWith("<p><b>ACHTUNG")){
					cont.setError(text);
					return;
				}
				var doc=JSON.parse(text);
				//Liste füllen			
				let lstEg= doc.DB.lst_f_eintrag;
				letge =null;
				for (var key in lstEg) {
					var obj = lstEg[key];
					for (var skey in obj) {
						var sobj = obj[skey];
						ge = new dom.f_eintrag(sobj._attributes.id,sobj.name._text,sobj.desc._text,sobj.val._text,sobj._attributes.thema,sobj._attributes.spr,sobj.date._text,sobj.edit._text);			
						lst.push(ge);
					}
				}			
			  },function(err){cont.setError(text)})
			});	
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getById=(nr)=>{
			for (let key of dao.einDao.getList())
				if(key.Id === nr){return key;break;}			
		}		
		let getLstByArt=(nr)=>{			
			let lstN=[];			
			for (let key of dao.einDao.getList()) if(key.Sprache === nr)lstN.push(key);
			return lstN;
		}
		return {getList: getList,getById: getById,getLstByArt: getLstByArt,fillLst:fillLst};
	})();
		
	return {einDao: einDao,sprDao: sprDao,temDao: temDao,subsprDao:subsprDao}; 
})();