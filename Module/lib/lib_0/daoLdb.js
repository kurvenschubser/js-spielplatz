/*
Fitness Stammdaten DAO LowDb
change:21.03-2020
*/
"use strict";
let dao=(function(){

	let artDao=(function(){
		let lst=[];
		let getList=async ()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					view_h.setWait(true);
					fetch(`${ini.CONFOBJ.url}&a=0&ac=0`).then(
						function(response) {
							response.text().then(text => {
									if(text.startsWith("<p><b>ACHTUNG")){
										cont.setError(text);
										return '';
									}
									if(text==='') return '';
									let doc=JSON.parse(text);
									let ge =null;
									for (let val of JSON.parse(doc)) {
										ge = new dom.f_arten(val.id,val.name,val.beschreibung);
										lst.push(ge);
									}
								}).then(result=>{
									setTimeout(() => view_h.setWait(false), 1000);
									resolve(lst);
								})//ende response.then
						}//ende  response)
					)//ende fetch.then
				}
				else {resolve(lst)}
			});
		}
		let getById=async (nr)=>{
			return new Promise((resolve, reject) => {
				let ret={};
				getList().then(result=>{
					for (let key of lst) {
						if(key.Id === parseInt(nr)){
							ret= key;
							break;
						}
					}
					resolve(ret);
				});
			});
		}
		let insert=async (m,p,s,a)=>{
			let val = await data(m,p,s,a,1)
			console.log(val)
		}
		let update=async (m,p,s,a)=>{
			let val = await data(m,p,s,a,2)
			console.log(val)
		}
		let del=async (m,p,s,a)=>{
			let val = await data(m,p,s,a,3)
			console.log(val)
		}
		return {getList: getList,getById: getById,insert:insert,update:update,del:del};
	})();

	let egDao=(function(){
		let lst=[];
		let getList=async ()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					view_h.setWait(true)
					fetch(`${ini.CONFOBJ.url}&a=1&ac=0`).then(
						function(response) {
							response.text().then(text => {
									if(text.startsWith("<p><b>ACHTUNG")){
										cont.setError(text);
										return '';
									}
									if(text==='') return '';

									let doc=JSON.parse(text);
									let ge =null;
									for (let val of JSON.parse(doc)) {
										let tmp=val.farbe.split(',');
										let cl= hlp.rgb2hex(tmp[0],tmp[1],tmp[2]);
											ge = new dom.f_eigenschaft(val.id,val.name,val.beschreibung,cl,val.sortfield);
											lst.push(ge);
									}
								}).then(result=>{
									setTimeout(() => view_h.setWait(false), 1000);
									resolve(lst);
								})//ende response.then
						}//ende (response)
					)//ende fetch.then
				}
				else {resolve(lst)}
			});
		}
		let getById=async (nr)=>{
			return new Promise((resolve, reject) => {
				let ret={};
				getList().then(result=>{
					for (let key of lst) {
						if(key.Id === parseInt(nr)){
							ret= key;
							break;
						}
					}
					resolve(ret);
				});
			});
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
		return {getList: getList,getById: getById,insert:insert,update:update,del:del};
	})();

	let gerDao=(function(){
		let lst=[];
		let getList=async ()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					view_h.setWait(true)
					fetch(`${ini.CONFOBJ.url}&a=2&ac=0`).then(
						function(response) {
							response.text().then(text => {
									if(text.startsWith("<p><b>ACHTUNG")){
										cont.setError(text);
									}
									if(text==='') return '';
									let doc=JSON.parse(text);
									let ge =null;
									for (let val of JSON.parse(doc)) {
										ge = new dom.f_geraete(val.id,val.name,val.beschreibung,val.art,val.bild);
										lst.push(ge);
									}
								}).then(result=>{
									setTimeout(() => view_h.setWait(false), 1000);
									resolve(lst);
								})//ende response.then
						}//ende (response)
					)//ende fetch.then
				}
				else {resolve(lst)}
			});
		}
		let getById=async (nr)=>{
			return new Promise((resolve, reject) => {
				let ret={};
				getList().then(result=>{
					for (let key of lst) {
						if(key.Id === parseInt(nr)){
							ret= key;
							break;
						}
					}
					resolve(ret);
				});
			});
		}
		let getLstByArt=(nr)=>{
			return new Promise((resolve, reject) => {
				let nLst=[];
				getList().then(result=>{
					for (let key of lst) {
						if(key.Art === parseInt(nr))
							nLst.push(key)
					};
					resolve(nLst)
				});
			});
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
		return {getList: getList,getById: getById,getLstByArt: getLstByArt,insert:insert,update:update,del:del};
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
		xhr.onreadystatechange = ()=> {
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
