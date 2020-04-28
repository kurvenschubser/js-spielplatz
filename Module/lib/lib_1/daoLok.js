/*
Programmierhilfe Stammdaten DAO Lokal
*/
"use strict";
let dao=(function(){

	let einDao=(function(){
		var lst=[];
		let lstUseSpr;
		let lstUseThema;
		let lstUseEin;

		let getList=()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					//constructor(id,name,desc,text,thema,spr,sort,date,edit)
					let ge = new dom.f_eintrag(1,'Arrow Operator','Der Ausdruck einer Pfeilfunktion hat eine kürzere Syntax als ein Funktionsausdruck und hat kein eigenes this',
					'console.log(materials.map(material => material.length));',
					2,2,'2020-04-08 07:21:47.933','2020-04-08 07:21:47.933');
					lst.push(ge);
					ge = new dom.f_eintrag(2,'For Loop','wie foreach',
					"for (var [key, value] of phoneBookMap) {\r\n\tconsole.log(key + 's phone number is: ' + value);\r\n}",
					2,2,'2020-04-08 07:21:47.933','2020-04-08 07:21:47.933');
					ge = new dom.f_eintrag(3,'Map',
					'iterable list',
					"let map = new Map;\r\nmap.set('michi', '0421 605809');\r\nmap.set('klaus', '04222 1386');\r\nfor (var [key, value] of map) {\r\ndiv.insertAdjacentHTML('beforeend', '<p><b>Kontakt: '+key +' '+value+'</b></p>');\r\n}\r\n",
					2,2,'2020-04-08 07:21:47.933','2020-04-08 07:21:47.933');
					lst.push(ge);
					resolve(lst)
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
					});
				}
				catch (e) {cont.setError(e)}
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
					});
				}
				catch (e) {cont.setError(e)}
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
							});
						});
					}
					else {
						resolve(lstUseSpr);
					}
				}
				catch (e) {cont.setError(e)}
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
									if(key.Thema === keytem.Id && key.Sprache === nr){
										lstUseThema.push(keytem);
										break;
									}
								};
							};
							resolve(lstUseThema);
						});
					});
				}
				catch (e) {cont.setError(e)}
			});
		}

		let getLstBySprThema=(spr,tem)=>{
			return new Promise((resolve, reject) => {
				try{
					lstUseEin=[];
					getList().then(result=>{
						for (let key of result) {
							if(key.Thema === tem && key.Sprache === spr){
								lstUseEin.push(key);
							}
						};
						resolve(lstUseEin);
					});
				}
				catch (e) {cont.setError(e)}
			});
		}

		return {getList,getById,getLstByArt,getLstUseSpr,getLstUseThema,getLstBySprThema};
	})();

	let sprDao=(function(){
		//f_sprache constructor(id,name,desc,date,edit)
		var lst=[];
		let getList=()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					//constructor(id,name,desc,text,thema,spr,sort,date,edit)
					let ge = new dom.f_sprache(1,'C#','Programmiersprache C# auf der .NET-Plattform','2020-04-08 07:21:47.933','2020-04-08 07:21:47.933');
					lst.push(ge);
					ge = new dom.f_sprache(2,'Javascript','Skriptsprache für Webseiten','2020-04-08 07:21:47.933','2020-04-08 07:21:47.933');
					lst.push(ge);
					ge = new dom.f_sprache(3,'SQL','Programmiersprache für Datenbanken','2020-04-08 07:21:47.933','2020-04-08 07:21:47.933');
					lst.push(ge);
					resolve(lst)
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
					});
				}
				catch (e) {cont.setError(e)}
			});
		}

		return {getList,getById,getList};
	})();

	let temDao=(function(){
		//f_thema constructor(id,name,desc,date,edit)
		var lst=[];
		let getList=()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					let eg = new dom.f_thema(1,'Variable','Definition','2020-04-08 07:21:47.933','2020-04-08 07:21:47.933');
					lst.push(eg);
					eg = new dom.f_thema(2,'Function','Definition','2020-04-08 07:21:47.933','2020-04-08 07:21:47.933');
					lst.push(eg);
					eg = new dom.f_thema(3,'String','Definition','2020-04-08 07:21:47.933','2020-04-08 07:21:47.933');
					lst.push(eg);
					resolve(lst)
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
					});
				}
				catch (e) {cont.setError(e)}
			});
		}
		return {getList,getById,getList};
	})();

	let data = (m,p,s,a,ac) => {
		try{
			let prom = new Promise((resolve,reject) => {
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
			});
			return prom
		}
		catch (e) {
			console.log('data catch ',e);
			throw e;
		}
	}

	let insert=(m,p,s,a)=>{
		try{return new Promise((resolve,reject) => {resolve(m.Id);})}
		catch (e) { throw e; }
	}

	let update=(m,p,s,a)=>{
		try{return new Promise((resolve,reject) => {resolve(m.Id);})}
		catch (e) { throw e; }
	}

	let del=(m,p,s,a)=>{
		try{return new Promise((resolve,reject) => {resolve(m.Id);})}
		catch (e) { throw e; }
	}

	return {einDao,sprDao,temDao,insert,update,del};
})();
