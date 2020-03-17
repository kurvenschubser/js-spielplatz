/*
Programmierhilfe Stammdaten DAO
*/
"use strict";
let dao=(function(){
	let einDao=(function(){
		//f_eintrag constructor(id,name,desc,val,thema,sub_spr,spr,date,edit)
		var lst=[];
		let fillLst=()=>{					
			let ge = new dom.f_eintrag(1,'Arrow Operator','Der Ausdruck einer Pfeilfunktion hat eine kürzere Syntax als ein Funktionsausdruck und hat kein eigenes this',
			'console.log(materials.map(material => material.length));',
			2,2,2,Date.now(),Date.now());			
			lst.push(ge);
			ge = new dom.f_eintrag(2,'For Loop','wie foreach',
			"for (var [key, value] of phoneBookMap) {\r\n\tconsole.log(key + 's phone number is: ' + value);\r\n}",
			1,2,2,Date.now(),Date.now());
			ge = new dom.f_eintrag(3,'Map',
			'iterable list',
			"let map = new Map;\r\nmap.set('michi', '0421 605809');\r\nmap.set('klaus', '04222 1386');\r\nfor (var [key, value] of map) {\r\ndiv.insertAdjacentHTML('beforeend', '<p><b>Kontakt: '+key +' '+value+'</b></p>');\r\n}\r\n",
			1,2,2,Date.now(),Date.now());
			lst.push(ge);
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getById=(nr)=>{for (let key of getList()) {if(key.Id === parseInt(nr)){return key;break;}}}
		let getLstByArt=(nr)=>{			
			let lstN=[];			
			for (let key of getList()) if(key.Sprache === parseInt(nr))lstN.push(key);
			return lstN;
		}
		return {getList: getList,getById: getById,getLstByArt: getLstByArt,fillLst:fillLst};
	})();
	let sprDao=(function(){
		//f_sprache constructor(id,name,desc,date,edit)
		var lst=[];
		let fillLst=()=>{			
			let ge = new dom.f_sprache(1,'C#','Programmiersprache C# auf der .NET-Plattform',Date.now(),Date.now());			
			lst.push(ge);
			ge = new dom.f_sprache(2,'Javascript','Skriptsprache für Webseiten',Date.now(),Date.now());			
			lst.push(ge);
			ge = new dom.f_sprache(3,'SQL','Programmiersprache für Datenbanken',Date.now(),Date.now());			
			lst.push(ge);
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}		
		let getById=(nr)=>{for (let key of getList()) if(key.Id === parseInt(nr)){return key;break;}}
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();
	let subsprDao=(function(){
		//f_sub_thema constructor(id,name,desc,date,edit)
		var lst=[];
		let fillLst=()=>{			
			let ge = new dom.f_sub_thema(1,'Dateien','-',Date.now(),Date.now());			
			lst.push(ge);
			ge = new dom.f_sub_thema(2,'Datenbank System','-',Date.now(),Date.now());			
			lst.push(ge);
			ge = new dom.f_sub_thema(3,'Linq Abfragen','-',Date.now(),Date.now());			
			lst.push(ge);
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}		
		let getById=(nr)=>{for (let key of getList()) if(key.Id === parseInt(nr)){return key;break;}}
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();
	let temDao=(function(){
		//f_thema constructor(id,name,desc,date,edit)
		var lst=[];
		let fillLst=()=>{	
			let eg = new dom.f_thema(1,'Variable','Definition',Date.now(),Date.now());
			lst.push(eg);			
			eg = new dom.f_thema(2,'Function','Definition',Date.now(),Date.now());
			lst.push(eg);
			eg = new dom.f_thema(3,'String','Definition',Date.now(),Date.now());
			lst.push(eg);
		}			
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;}
		let getById=(nr)=>{for (let key of dao.temDao.getList()) if(key.Id === parseInt(nr)){return key;break;}}
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();	
	return {einDao: einDao,sprDao: sprDao,subsprDao:subsprDao,temDao: temDao}; 
})();