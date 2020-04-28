//Fitness Stammdaten DAO XML
let dao=(function(){
	"use strict";

	let artDao=(function(){
		let lst=[];

		let getList=()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					view_h.setWait(true);
					try{
						fetch(`${ini.CONFOBJ.url}&a=0&ac=0`).then(
							function(response) {
								response.text().then(function(text) {
									let doc;
									try{doc=JSON.parse(text)}
									catch (e) {reject(e)}
									if(doc.art && doc.art == 'Error'){reject(Error(doc.msg))}
									doc=JSON.parse(JSON.parse(text)) ;
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
							if(key.Id === nr){
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
									doc=JSON.parse(JSON.parse(text));
									let lstart =doc.DB.lst_f_eigenschaft;
									let ge =null;
									for (let key in lstart) {
										let obj = lstart[key];
										for (let skey in obj) {
											let sobj = obj[skey];
											let cl= hlp.rgb2hex(sobj.farbe._attributes.r,sobj.farbe._attributes.g,sobj.farbe._attributes.b);
											ge = new dom.f_eigenschaft(sobj._attributes.id,sobj.name._text,sobj.desc._text,cl,sobj._attributes.sort);
											lst.push(ge);
										}
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
							if(key.Id === nr){
								ret= key;
								break;
							}
						}
						resolve(ret);
					}).catch(e=>{reject(e)})
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
						fetch(`${ini.CONFOBJ.url}&a=2&ac=0`).then(
							function(response) {
								response.text().then(function(text) {
									let doc;
									try{doc=JSON.parse(JSON.parse(text))}
									catch (e) {reject(e)}
									if(doc.art && doc.art == 'Error'){reject(Error(doc.msg))}
									doc=JSON.parse(JSON.parse(text));
									let lstart =doc.DB.lst_f_geraete;
									let ge =null;
									for (let key in lstart) {
										let obj = lstart[key];
										for (let skey in obj) {
											let sobj = obj[skey];
											ge = new dom.f_geraete(sobj._attributes.id,sobj.name._text,sobj.desc._text,sobj._attributes.art,sobj.bild._text);
											lst.push(ge);
										}
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
							if(key.Id === nr){
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
						for (let key of result) {
							if(parseInt(key.Art) === nr){
								nLst.push(key);
							}
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
