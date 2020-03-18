/*
Fitness Stammdaten DAO
*/
"use strict";
let dao=(function(){
	let artDao=(function(){
		//constructor(id,name,desc){super(id,name,desc)
		let lst=[];
		let fillLst=async()=>{
			return new Promise((resolve,reject) => {
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
							return lst;
					  })
						return lst;
					}
				);
				resolve(lst);
			});
		}
		let getList=()=>{
				return new Promise((resolve, reject) => {
					if(lst===null || lst.length ==0){
						view_h.setWait(true);
						fillLst().then(result=>{
	//console.log('dao getList',result);
							setTimeout(() => view_h.setWait(false), 1000);
							resolve(result);
						});
					}
					else {resolve(lst)}
			});
		}
		let getById=(nr)=>{
			return new Promise((resolve, reject) => {
				let ret={};
				getList().then(result=>{
					for (let key of result) {
	//console.log('dao getById for ',key);
						if(key.Id === nr){
							ret= key;
							break;
						}
					}
	//console.log('dao getById ',ret);
					return ret;
				}).then(res=>{resolve(ret)});
			});
		}
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();
	let egDao=(function(){
		//constructor(id,name,desc,farbe,sort)
		let lst=[];
		let fillLst=async()=>{
			return new Promise((resolve,reject) => {
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
							return lst;
						})
						return lst;
					}
				);
				resolve(lst);
			});
		}
		let getList=()=>{
				return new Promise((resolve, reject) => {
					if(lst===null || lst.length ==0){
						view_h.setWait(true);
						fillLst().then(result=>{
	//console.log('dao getList',result);
							setTimeout(() => view_h.setWait(false), 1000);
							resolve(result);
						});
					}
					else {resolve(lst)}
			});
		}
		let getById=(nr)=>{
			return new Promise((resolve, reject) => {
				let ret={};
				getList().then(result=>{
					for (let key of result) {
	//console.log('dao getById for ',key);
						if(key.Id === nr){
							ret= key;
							break;
						}
					}
	//console.log('dao getById ',ret);
					return ret;
				}).then(res=>{resolve(ret)});
			});
		}
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();
	let gerDao=(function(){
		//constructor(id,name,desc,art,bild)
		let lst=[];
		let fillLst=async()=>{
			return new Promise((resolve,reject) => {
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
							return lst;
						})
						return lst;
					}
				);
				resolve(lst);
			});
		}
		let getList=()=>{
				return new Promise((resolve, reject) => {
					if(lst===null || lst.length ==0){
						view_h.setWait(true);
						fillLst().then(result=>{
	//console.log('dao getList',result);
							setTimeout(() => view_h.setWait(false), 1000);
							resolve(result);
						});
					}
					else {resolve(lst)}
			});
		}
		let getById=(nr)=>{
			return new Promise((resolve, reject) => {
				let ret={};
				getList().then(result=>{
					for (let key of result) {
	//console.log('dao getById for ',key);
						if(key.Id === nr){
							ret= key;
							break;
						}
					}
	//console.log('dao getById ',ret);
					return ret;
				}).then(res=>{resolve(ret)});
			});
		}
		let getLstByArt=(nr)=>{
			return new Promise((resolve, reject) => {
				let nLst=[];
				getList().then(result=>{
					for (let key of lst) {
						console.log('dao getById for ',key.Art,nr);
						if(key.Art === nr)
							nLst.push(key)
					};
					return nLst;
				}).then(res=>{resolve(nLst)});
			});
		}
		return {getList: getList,getById: getById,getLstByArt: getLstByArt,fillLst:fillLst};
	})();

	return {artDao: artDao,gerDao: gerDao,egDao: egDao};
})();
