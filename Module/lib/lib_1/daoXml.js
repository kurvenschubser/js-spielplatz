//Programmierhilfe Stammdaten DAO XML
let dao=(function(){
	"use strict";
	let sprDao=(function(){
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
									try{
										doc=JSON.parse(text);
										if(doc.art && doc.art == 'Error'){reject(Error(doc.msg));}
										doc=JSON.parse(JSON.parse(text));
										//Liste füllen
										let lstSpr= doc.DB.lst_f_sprache;
										let ge =null;
										for (let key in lstSpr) {
											let obj = lstSpr[key];
											for (let skey in obj) {
												let sobj = obj[skey];
												ge = new dom.f_sprache(sobj._attributes.id,sobj.name._text,sobj.desc._text,sobj.date._text,sobj.edit._text);
												lst.push(ge);
											}
										}
									}
									catch (e) { throw e }
								}).then(result=>{resolve(lst)})//ende response.then
							}//ende function (response)
						)//ende fetch.then
						.catch(e=>{reject(e);})
					}
					catch (e) {reject(e);}
				}
				else {resolve(lst)}
			});
		}

		let getById=(nr)=>{
			return new Promise((resolve, reject) => {
				let ret={};
				try{
					getList().then(result=>{
						for (let key of result) {
							if(key.Id === nr){
								ret= key;
								break;
							}
						}
						resolve(ret);
					}).catch(e=>{reject(e);});
				}
				catch (e) {reject(e);}
			});
		}

		let getLstByArt=(nr)=>{
			return new Promise((resolve, reject) => {
				let nLst=[];
				try{
					getList().then(result=>{
							einDao.getList().then(val=>{
								for (let key of lst) {
									for (let keyEin of val) {
										if (keyEin.Sprache===key.id && !(key in nLst)) {
												nLst.push(key);
										}
									}
								};
							}).catch(e=>{reject(e);});
						resolve(nLst)
					}).catch(e=>{reject(e);});
				}
				catch (e) {reject(e);}
			});
		}

		return {getList,getById,getLstByArt};
	})();

	let temDao=(function(){
		//f_thema constructor(id,name,desc,date,edit)
		let lst=[];

		let getList=()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					view_h.setWait(true);
					try{
						fetch(`${ini.CONFOBJ.url}&a=1&ac=0`).then(
							function(response) {
								response.text().then(function(text) {
									let doc;
									try{
										doc=JSON.parse(text);
										if(doc.art && doc.art == 'Error'){reject(Error(doc.msg))}
										doc=JSON.parse(JSON.parse(text));
										let lstThema =doc.DB.lst_f_thema;
										let ge =null;
										for (let key in lstThema) {
											let obj = lstThema[key];
											for (let skey in obj) {
												let sobj = obj[skey];
												ge = new dom.f_thema(sobj._attributes.id,sobj.name._text,sobj.desc._text,sobj.date._text,sobj.edit._text);
												lst.push(ge);
											}
										}
									}
									catch (e) { throw e }
								}).then(result=>{resolve(lst)})//ende response.then
							}//ende function (response)
						)//ende fetch.then
						.catch(e=>{reject(e);})
					}
					catch (e) {reject(e);}
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
					}).catch(e=>{reject(e);});
				}
				catch (e) {reject(e);}
			});
		}

		let getLstByArt=(nr)=>{
			return new Promise((resolve, reject) => {
				let nLst=[];
				try{
					getList().then(result=>{
						for (let key of lst) {
							if(key.Sprache === parseInt(nr))
								nLst.push(key)
						};
						resolve(nLst)
					}).catch(e=>{reject(e);});
				}
				catch (e) {reject(e);}
			});
		}

		return {getList,getById,getLstByArt};
	})();

	let einDao=(function(){
		//f_eintrag constructor(id,name,desc,val,thema,sub_spr,spr,date,edit)
		let lst=[];
		let lstUseSpr;
		let lstUseThema;
		let lstUseEin;

		let getList=()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					view_h.setWait(true);
					try{
						fetch(`${ini.CONFOBJ.url}&a=2&ac=0`).then(
							function(response) {
								response.text().then(function(text) {
									let doc;
									try{
										doc=JSON.parse(text);
										if(doc.art && doc.art == 'Error'){reject(Error(doc.msg));}
										doc=JSON.parse(JSON.parse(text));
										//Liste füllen
										let lstEg= doc.DB.lst_f_eintrag;
										let ge =null;
										for (let key in lstEg) {
											let obj = lstEg[key];
											for (let skey in obj) {
												let sobj = obj[skey];
												ge = new dom.f_eintrag(sobj._attributes.id,sobj.name._text,sobj.desc._text,sobj.val._text,sobj._attributes.thema,sobj._attributes.spr,'0',sobj.date._text,sobj.edit._text);
												lst.push(ge);
											}
										}
									}
									catch (e) { throw e }
								}).then(result=>{resolve(lst)})//ende response.then
							}//ende function (response)
						)//ende fetch.then
						.catch(e=>{reject(e)})
					}
					catch (e) {reject(e);}
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
					}).catch(e=>{reject(e);});
				}
				catch (e) {reject(e);}
			});
		}

		let getLstByArt=(nr)=>{
			return new Promise((resolve, reject) => {
				let nLst=[];
				try{
					getList().then(result=>{
						for (let key of lst) {
							if(key.Thema === parseInt(nr))
								nLst.push(key)
						};
						resolve(nLst)
					}).catch(e=>{reject(e);});
				}
				catch (e) {reject(e);}
			});
		}

		let getLstUseSpr=()=>{
			return new Promise((resolve, reject) => {
				try{
					if (!lstUseSpr) {
						lstUseSpr=[];
						getList().then(result=>{
							sprDao.getList().then(val=>{
								let lstSpr=val;
								for (let keyspr of lstSpr) {
									for (let key of result) {
										if(key.Sprache === keyspr.Id){
											lstUseSpr.push(keyspr);
											break;
										}
									};
								};
								resolve(lstUseSpr);
							}).catch(e=>{reject(e);});
						}).catch(e=>{reject(e);});
					}
					else {
						resolve(lstUseSpr);
					}
				}
				catch (e) {reject(e);}
			});
		}

		let getLstUseThema=(nr)=>{
			return new Promise((resolve, reject) => {
				try{
					lstUseThema=[];
					getList().then(result=>{
						temDao.getList().then(val=>{
							let lstTem=val;
							for (let keytem of lstTem) {
								for (let key of result) {
									if(key.Thema === keytem.Id && parseInt(key.Sprache) === nr){
										lstUseThema.push(keytem);
										break;
									}
								};
							};
							resolve(lstUseThema);
						}).catch(e=>{reject(e);});
					}).catch(e=>{reject(e);});
				}
				catch (e) {reject(e);}
			});
		}

		let getLstBySprThema=(spr,tem)=>{
			return new Promise((resolve, reject) => {
				try{
					lstUseEin=[];
					getList().then(result=>{
						for (let key of result) {
							if(parseInt(key.Thema) === tem && parseInt(key.Sprache) === spr){
								lstUseEin.push(key);
							}
						};
						resolve(lstUseEin);
					}).catch(e=>{reject(e);});
				}
				catch (e) {reject(e);}
			});
		}

		return {getList,getById,getLstByArt,getLstUseSpr,getLstUseThema,getLstBySprThema};
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
				//constructor(id,name,desc,date,edit)
				if(a==0) data =JSON.stringify([{id:m.Id,bez:m.Name,beschr:m.Beschreibung,datum:m.Datum,edit:m.Edit}])
				//constructor(id,name,sprache,date,edit)
				else if(a==1) data =JSON.stringify([{id:m.Id,sub_desc:m.Name,spr:m.Sprache,datum:m.Datum,edit:m.Edit}])
				//constructor(id,name,desc,text,thema,spr,sort,date,edit)
				else if(a==2)data =JSON.stringify([{id:m.Id,titel:m.Name,text:m.Text,sub:m.Thema,lang:m.Sprache,sort:m.sort,datum:m.Datum,edit:m.Edit}])
				xhr.send(val);
			}
			catch (e) { reject(e);}
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

	return {einDao,sprDao,temDao,insert,update,del};
})();
