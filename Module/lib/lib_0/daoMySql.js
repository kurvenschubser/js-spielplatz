//Fitness Stammdaten DAO MySql
let dao=(function(){
	"use strict";

	let artDao=(function(){
		let lst=[];

		let getList=()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					view_h.setWait(true);
					try{
						console.log(`${ini.CONFOBJ.url}&a=0&ac=0`);
						fetch(`${ini.CONFOBJ.url}&a=0&ac=0`).then(
							function(response) {
								response.text().then(function(text) {
									let doc;
									try{doc=JSON.parse(text);
										console.log(doc);
									}
									catch (e) {reject(e)}
									if(doc.art && doc.art == 'Error'){reject(Error(doc.msg))}
									console.log(doc);
									let ge =null;
									for (let val of doc) {
										ge = new dom.f_arten(val.id,val.name,val.beschreibung);
										lst.push(ge);
									}
								}).then(result=>{resolve(lst)})//ende response.then
							}//ende function (response)
						)//ende fetch.then
						.catch(e=>{reject(e)})
					}
					catch (e) {reject(e)}
				}
				else {resolve(lst)}
			});
		}

		let getById=(nr)=>{
			return new Promise((resolve, reject) => {
				let ret={};
				try{
					getList().then(result=>{
						for (let key of lst) {
							if(key.Id === parseInt(nr)){
								ret= key;
								break;
							}
						}
						resolve(ret);
					}).catch(e=>{reject(e)});
				}
				catch (e) {cont.setError(e)}
			});
		}

		return {getList,getById};
	})();

	let egDao=(function(){
		let lst=[];

		let getList=()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					view_h.setWait(true);
					try{
						fetch(`${ini.CONFOBJ.url}&a=1&ac=0`).then(
							function(response) {
								response.text().then(function(text) {
									if(text===null || text==='') return '';
									let doc;
									try{doc=JSON.parse(text)}
									catch (e) {reject(e)}
									if(doc.art && doc.art == 'Error'){reject(Error(doc.msg))}
									let ge =null;
									for (let val of doc) {
										let tmp=val.farbe.split(',');
										let cl= hlp.rgb2hex(tmp[0],tmp[1],tmp[2]);
											ge = new dom.f_eigenschaft(val.id,val.name,val.beschreibung,cl,val.sortfield);
											lst.push(ge);
									}
								}).then(result=>{resolve(lst)	})//ende response.then
							}//ende function (response)
						)//ende fetch.then
						.catch(e=>{reject(e)})
					}
					catch (e) {reject(e)}
				}
				else {resolve(lst)}
			});
		}

		let getById=(nr)=>{
			return new Promise((resolve, reject) => {
				let ret={};
				try{
					getList().then(result=>{
						for (let key of lst) {
							if(key.Id === parseInt(nr)){
								ret= key;
								break;
							}
						}
						resolve(ret);
					}).catch(e=>{reject(e)});
				}
				catch (e) {reject(e)}
			});
		}

		return {getList,getById};
	})();

	let gerDao=(function(){
		let lst=[];
		let lstUseArt;

		let getList=()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					view_h.setWait(true);
					try{
						console.log(`${ini.CONFOBJ.url}&a=2&ac=0`)
						fetch(`${ini.CONFOBJ.url}&a=2&ac=0`).then(
							function(response) {
								response.text().then(function(text) {
									let doc;
									try{doc=JSON.parse(text)}
									catch (e) {reject(e)}
									if(doc.art && doc.art == 'Error'){reject(Error(doc.msg))}
									let ge =null;
									for (let val of doc) {
										ge = new dom.f_geraete(val.id,val.name,val.beschreibung,val.art,val.bild);
										lst.push(ge);
									}
								}).then(result=>{resolve(lst)})//ende response.then
							}//ende function (response)
						)//ende fetch.then
						.catch(e=>{reject(e)})
					}
					catch (e) {reject(e)}
				}
				else { resolve(lst) }
			});
		}

		let getById=(nr)=>{
			return new Promise((resolve, reject) => {
				let ret={};
				try{
					getList().then(result=>{
						for (let key of lst) {
							if(key.Id === parseInt(nr)){
								ret= key;
								break;
							}
						}
						resolve(ret);
					}).catch(e=>{reject(e)});
				}
				catch (e) {reject(e)}
			});
		}

		let getLstByArt=(nr)=>{
			return new Promise((resolve, reject) => {
				let nLst=[];
				try{
					getList().then(result=>{
						for (let key of lst) {
							if(key.Art === parseInt(nr))
								nLst.push(key)
						};
						resolve(nLst)
					}).catch(e=>{reject(e)});
				}
				catch (e) {reject(e)}
			});
		}

		let getLstUseArten=()=>{
			return new Promise((resolve, reject) => {
				try{
					if (!lstUseArt) {
						lstUseArt=[];
						getList().then(result=>{
							artDao.getList().then(val=>{
								let lstArt=val;
								for (let keyart of lstArt) {
									for (let key of result) {
										if(key.Art === keyart.Id){
											lstUseArt.push(keyart);
											break;
										}
									};
								};
								resolve(lstUseArt);
							}).catch(e=>{reject(e)});
						}).catch(e=>{reject(e)});
					}
					else {resolve(lstUseArt)}
				}
				catch (e) {reject(e)}
			});
		}

		return {getList,getById,getLstByArt,getLstUseArten};
	})();

	let data = (m,p,s,a,ac) => {
		let prom = new Promise((resolve,reject) => {
			try{
				let xhr = new XMLHttpRequest();
				let url = `${ini.CONFOBJ.url}&a=${a}&ac=${ac}`;
				//let url = `/api/?p=${p}&s=${s}&a=${a}&ac=${ac}`;
				if(ac===0){xhr.open("GET", url, true)}
				else{xhr.open("POST", url, true)}
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4 && xhr.status === 200) {
						let result = this.responseText;
						resolve(result);
					}
				};
				let val =[]
				if(a==0) val = JSON.stringify([{id:m.Id,name:m.Name,beschreibung:m.Beschreibung}])
				else if(a==1) val = JSON.stringify([{id:m.Id,name:m.Name,beschreibung:m.Beschreibung,farbe:m.Farbe,sort:m.Sortierung}])
				else if(a==2) val = JSON.stringify([{id:m.Id,name:m.Name,beschreibung:m.Beschreibung,art:m.Art,bild:m.Bild}])
				xhr.send(val);
			}
			catch (e) {reject(e)}
		});
		return prom;
	}

	let insert=(m,p,s,a)=>{
		try{ return data(m,p,s,a,1); }
		catch (e) { throw e; }
	}

	let update=(m,p,s,a)=>{
		try{ return data(m,p,s,a,2); }
		catch (e) { throw e; }
	}

	let del=(m,p,s,a)=>{
		try{ return data(m,p,s,a,3); }
		catch (e) { throw e; }
	}

	return {artDao,gerDao,egDao,insert,update,del};
})();
