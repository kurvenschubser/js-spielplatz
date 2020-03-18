/*
Fitness Stammdaten DAO
*/
"use strict";
let dao=(function(){
	let artDao=(function(){
		//constructor(id,name,desc){super(id,name,desc)
		let lst=[];
		let fillLst=async()=>{
			let promise = new Promise((resolve, reject) => {
				fetch(`${ini.CONFOBJ.url}&a=0&ac=0`).then(
					function(response) {
					  response.text().then(function(text) {
							if(text.startsWith("<p><b>ACHTUNG")){
								cont.setError(text);
								return;
							}
							if(text==='') return;
							let doc=JSON.parse(text);
							let ge =null;
							for (let key in doc) {
								let obj = doc[key];
								ge = new dom.f_arten(obj.id,obj.name,obj.beschreibung);
								lst.push(ge);
							}
							resolve('Lst Arten done')
					  },
					  function(err){cont.setError(err)}
				)});
			});
			await promise;
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getById=(nr)=>{for (let key of getList()) {
			if(key.Id === parseInt(nr)){
				return key;
				break;
			}
		}}
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();
	let egDao=(function(){
		//constructor(id,name,desc,farbe,sort)
		let lst=[];
		let fillLst=async ()=>{
			let promise = new Promise((resolve, reject) => {
				fetch(`${ini.CONFOBJ.url}&a=1&ac=0`).then(
					function(response) {
					  response.text().then(function(text) {
							if(text.startsWith("<p><b>ACHTUNG")){
								cont.setError(text);
								return;
							}
							if(text==='') return;
							let doc=JSON.parse(text);
							//Liste füllen
							let ge =null;
							for (let key in doc) {
								let obj = doc[key];
								//255,255,0,128
								let tmp=obj.farbe.split(',');
								let cl= hlp.rgb2hex(tmp[0],tmp[1],tmp[2]);
									ge = new dom.f_eigenschaft(obj.id,obj.name,obj.beschreibung,cl,obj.sortfield);
									lst.push(ge);
							}
							resolve('Lst Eigenschaften done')
					  },
					  function(err){cont.setError(err)}
				)});
			});
			await promise;
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getById=(nr)=>{for (let key of dao.egDao.getList()) if(key.Id === parseInt(nr)){return key;break;}}
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();
	let gerDao=(function(){
		//constructor(id,name,desc,art,bild)
		let lst=[];
		let fillLst=async()=>{
			let promise = new Promise((resolve, reject) => {
			fetch(`${ini.CONFOBJ.url}&a=2&ac=0`).then(
				function(response) {
				  response.text().then(function(text) {
					if(text.startsWith("<p><b>ACHTUNG")){
						cont.setError(text);
						return;
					}
					if(text==='') return;
					let doc=JSON.parse(text);
					let ge =null;
					for (let key in doc) {
						let obj = doc[key];
						ge = new dom.f_geraete(obj.id,obj.name,obj.beschreibung,obj.art,obj.bild);
						lst.push(ge);
					}
					resolve('Lst Geräte done')
				  },
				  function(err){cont.setError(err)}
				)});
			});
			await promise;
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getLstByArt=(nr)=>{
			let nLst=[];
			for (let key of getList()) {if(key.Art === parseInt(nr))nLst.push(key)};
			return nLst;
		}
		let getById=(nr)=>{for (let key of dao.gerDao.getList()) if(key.Id === parseInt(nr)){return key;break;}}
		return {getList: getList,getById: getById,getLstByArt: getLstByArt,fillLst:fillLst};
	})();

	return {artDao: artDao,gerDao: gerDao,egDao: egDao};
})();
