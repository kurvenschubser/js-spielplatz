/*
Fitness Stammdaten DAO
*/
"use strict";
let dao=(function(){
	let artDao=(function(){
		let lst=[];
		async function fillLst(){
			return fetch(`${ini.CONFOBJ.url}&a=0&ac=0`).then(
				function(response) {
					response.text().then(function(text) {
							if(text.startsWith("<p><b>ACHTUNG")){
								cont.setError(text);
								return '';
							}
							if(text==='') return;
							let doc=JSON.parse(text);
							let ge =null;
							for (let val of JSON.parse(doc)) {
								ge = new dom.f_arten(val.id,val.name,val.beschreibung);
								lst.push(ge);
							}
							return 'response done';
						})//ende response.then
				}//ende function (response)
				//return 'fetch done';
			)//ende fetch.then
		}
		let getList=()=>{
			return new Promise((resolve, reject) => {
			if(lst===null || lst.length ==0){
				view_h.setWait(true);
				fillLst().then(result=>{
					//console.log(lst);
					setTimeout(() => view_h.setWait(false), 1000);
					return lst;
				});
			}
			else
				return lst;
			});
		}
		let getById=(nr)=>{for (let key of dao.artDao.getList()) {
			if(key.Id === parseInt(nr)){
				return key;
				break;
			}
		}}
		let insert=async (m,p,s,a)=>{
			let val = await data(m,p,s,a,1)
			console.log(val)
		}
		let update=async (m,p,s,a)=>{
			console.log(m,p,s,a)
			let val = await data(m,p,s,a,2)
			console.log(val)
		}
		let del=async (m,p,s,a)=>{
			let val = await data(m,p,s,a,3)
			console.log(val)
		}
		return {getList: getList,getById: getById,fillLst:fillLst,insert:insert,update:update,del:del};
	})();
	let egDao=(function(){
		let lst=[];
		async function fillLst(){
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
					for (let val of JSON.parse(doc)) {
						let tmp=val.farbe.split(',');
						let cl= hlp.rgb2hex(tmp[0],tmp[1],tmp[2]);
							ge = new dom.f_eigenschaft(val.id,val.name,val.beschreibung,cl,val.sortfield);
							lst.push(ge);
					}
				  },
				  function(err){cont.setError(err)}
				)});
			});
			await promise;
		}
		let getList=()=>{
			if(lst===null || lst.length ==0){
				(async () => {
					let promise = new Promise((resolve, reject) => {
						view_h.setWait(true);
						fillLst();
						setTimeout(() => resolve("done!"), 1000);
						view_h.setWait(false);
					});
					let result = await promise;
				})();
			}
			else return lst;
		}
		let getById=(nr)=>{for (let key of getList()) if(key.Id === parseInt(nr)){return key;break;}}
		let insert=(m,p,s,a)=>{
			let val = data(m,p,s,a,1)
			console.log(val)
		}
		let update=(m,p,s,a)=>{
			let val = data(m,p,s,a,2)
			console.log(val)
		}
		let del=(m,p,s,a)=>{
			let val = data(m,p,s,a,3)
			console.log(val)
		}
		return {getList: getList,getById: getById,fillLst:fillLst,insert:insert,update:update,del:del};
	})();
	let gerDao=(function(){
		let lst=[];
		async function fillLst(){
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
						for (let val of JSON.parse(doc)) {
							ge = new dom.f_geraete(val.id,val.name,val.beschreibung,val.art,val.bild);
							lst.push(ge);
						}
					},
					function(err){cont.setError(err)}
				)});
			});
			await promise;
		}
		let getList=()=>{
			if(lst===null || lst.length ==0){
				(async () => {
					let promise = new Promise((resolve, reject) => {
						view_h.setWait(true);
						fillLst();
						setTimeout(() => resolve("done!"), 1000);
						view_h.setWait(false);
					});
					let result = await promise;
				})();
			}
			else return lst;
		}
		let getLstByArt=(nr)=>{
			let nLst=[];
			for (let key of getList()) {if(key.Art === parseInt(nr))nLst.push(key)};
			return nLst;
		}
		let insert=(m,p,s,a)=>{
			let val = data(m,p,s,a,1)
			console.log(val)
		}
		let update=(m,p,s,a)=>{
			let val = data(m,p,s,a,2)
			console.log(val)
		}
		let del=(m,p,s,a)=>{
			let val = data(m,p,s,a,3)
			console.log(val)
		}
		let getById=(nr)=>{for (let key of getList()) if(key.Id === parseInt(nr)){return key;break;}}
		return {getList: getList,getById: getById,getLstByArt: getLstByArt,fillLst:fillLst,insert:insert,update:update,del:del};
	})();
	let data = (m,p,s,a,ac) => {
		let result;
		let xhr = new XMLHttpRequest();
		let url = `http://localhost:8888/?p=${p}&s=${s}&a=${a}&ac=${ac}`;
		if(ac===0){
			xhr.open("GET", url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
		}
		else{
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
		}
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {result = this.responseText}
		};
		var data =[]
		if(p==0){
			if(a==0) data =JSON.stringify([{id:m.Id,name:m.Name,beschreibung:m.Desc}])
			else if(a==1) data =JSON.stringify([{id:m.Id,name:m.Name,beschreibung:m.Desc,farbe:m.Farbe,sort:m.sort}])
			else if(a==2)data =JSON.stringify([{id:m.Id,name:m.Name,beschreibung:m.Desc,art:m.Art,bild:m.bild}])
		}
		xhr.send(data);
		return result;
	}
	return {artDao: artDao,gerDao: gerDao,egDao: egDao};
})();
