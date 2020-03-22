/*
Fitness Stammdaten DAO
*/
let dao=(function(){
	"use strict";
	let artDao=(function(){
		//constructor(id,name,desc){super(id,name,desc)
		var lst=[];
		let fillLst=()=>{
			let fart = new dom.f_arten(1,'Kraft','Kraftsport Muskelaufbau');
			lst.push(fart);
			fart = new dom.f_arten(2,'Cardio','Ausdauer Sport');
			lst.push(fart);
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getById=(nr)=>{for (let key of getList()) {if(key.Id === parseInt(nr)){return key;break;}}}
		return {getList,getById,fillLst};
	})();
	let egDao=(function(){
		//constructor(id,name,desc,farbe,sort)
		var lst=[];
		let fillLst=()=>{
			let eg = new dom.f_eigenschaft(1,'Kg','Kilogramm',hlp.rgb2hex(255,255,0),5);
			lst.push(eg);
			eg = new dom.f_eigenschaft(8,'Dauer','Minuten',hlp.rgb2hex(255,115,15),13);
			lst.push(eg);
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getById=(nr)=>{for (let key of getList()) if(key.Id === parseInt(nr)){return key;break;}}
		return {getList,getById,fillLst};
	})();
	let gerDao=(function(){
		//constructor(id,name,desc,art,bild)
		var lst=[];
		let fillLst=()=>{
			let ge = new dom.f_geraete(7,'Seilzug','Seilzugbeschreibung',1,'seilzug.jpg');
			lst.push(ge);
			ge = new dom.f_geraete(41,'Langhantel','-',2,'langhantel.jpg');
			lst.push(ge);
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getLstByArt=(nr)=>{
			let nLst=[];
			for (let key of getList()) {if(key.Art === parseInt(nr))nLst.push(key)};
			//console.log(nLst);
			return nLst;
		}
		let getById=(nr)=>{for (let key of dao.gerDao.getList()) if(key.Id === parseInt(nr)){return key;break;}}
		return {getList,getById,getLstByArt,fillLst};
	})();

	return {artDao,gerDao,egDao};
})();
