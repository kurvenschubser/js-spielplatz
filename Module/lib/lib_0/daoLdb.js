/*
Fitness Stammdaten DAO LowDb
*/
let dao=(function(){
	"use strict";
	let artDao=(function(){
		let lst=[];

		let getList=async ()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					view_h.setWait(true);
					try{
						fetch(`${ini.CONFOBJ.url}&a=0&ac=0`).then(
							function(response) {
								response.text().then(function(text) {
									let doc;
									try{
										doc=JSON.parse(JSON.parse(text));
									}
									catch (e) {
										view_h.setWait(false);
										cont.setError(text);
										return;
									}

									if(doc.art && doc.art == 'Error'){
										view_h.setWait(false);
										cont.setError(doc.msg);
										return;
									}
									let ge =null;
									for (let val of doc) {
										ge = new dom.f_arten(val.id,val.name,val.beschreibung);
										lst.push(ge);
									}
								}).then(result=>{
									setTimeout(() => view_h.setWait(false), 800);
									resolve(lst);
								})//ende response.then
							}//ende function (response)
						)//ende fetch.then
					}
					catch (e) {
						view_h.setWait(false);
						cont.setError(e);
					}
				}
				else {resolve(lst)}
			});
		}

		let getById=async (nr)=>{
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

		let insert=async (m,p,s,a)=>{
			try{
				let val = await data(m,p,s,a,1);
				cont.setError(val);
				console.log(val);
			}
			catch (e) {cont.setError(e)}
		}

		let update=async (m,p,s,a)=>{

				let prom = new Promise((resolve,reject) => {
					try{
						let val = data(m,p,s,a,2);
						resolve(val);
					}
					catch (e) { reject(e); }
				}).then(val => {
					console.log('update data then ',val);
					//cont.setError(val)
				}, rej => {
					console.log('update data reject ',rej);
					//cont.setError(rej)
				});
		}

		let del=async (m,p,s,a)=>{
			try{
				let val = await data(m,p,s,a,3);
				console.log(val);
			}
			catch (e) {cont.setError(e)	}
		}

		return {getList,getById,insert,update,del};
	})();

	let egDao=(
		function(){
		let lst=[];

		let getList=async ()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					view_h.setWait(true);
					try{
						fetch(`${ini.CONFOBJ.url}&a=1&ac=0`).then(
							function(response) {
								response.text().then(function(text) {
									if(text===null || text==='') return '';
									let doc;
									try{
										doc=JSON.parse(JSON.parse(text));
									}
									catch (e) {
										view_h.setWait(false);
										cont.setError(text);
										return;
									}

									if(doc.art && doc.art == 'Error'){
										view_h.setWait(false);
										cont.setError(doc.msg);
										return;
									}
									let ge =null;
									for (let val of doc) {
										let tmp=val.farbe.split(',');
										let cl= hlp.rgb2hex(tmp[0],tmp[1],tmp[2]);
											ge = new dom.f_eigenschaft(val.id,val.name,val.beschreibung,cl,val.sortfield);
											lst.push(ge);
									}
								}).then(result=>{
									setTimeout(() => view_h.setWait(false), 800);
									resolve(lst);
								})//ende response.then
							}//ende function (response)
						)//ende fetch.then
					}
					catch (e) {
						view_h.setWait(false);
						cont.setError(e);
					}
				}
				else {resolve(lst)}
			});
		}

		let getById=async (nr)=>{
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

		let insert=async(m,p,s,a)=>{
			try{
				let val = data(m,p,s,a,1);
				console.log(val);
			}
			catch (e) {cont.setError(e)}
		}

		let update=async(m,p,s,a)=>{
			try{
				let val = data(m,p,s,a,2);

			}
			catch (e) {
				console.log(e);
				view_h.setWait(false);
				cont.setError(e);
			}
		}

		let del=async(m,p,s,a)=>{
			try{
				let val = data(m,p,s,a,3);
				console.log(val);
			}
			catch (e) {cont.setError(e)}
		}

		return {getList,getById,insert,update,del};
	})();

	let gerDao=(function(){
		let lst=[];

		let getList=async ()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					view_h.setWait(true);
					try{
						fetch(`${ini.CONFOBJ.url}&a=2&ac=0`).then(
							function(response) {
								response.text().then(function(text) {
									if(text==='') return '';
									try{
										let doc=JSON.parse(text);
										if(doc.art && doc.art == 'Error'){
											view_h.setWait(false);
											cont.setError(doc);
										}
										let ge =null;
										for (let val of JSON.parse(doc)) {
											ge = new dom.f_geraete(val.id,val.name,val.beschreibung,val.art,val.bild);
											lst.push(ge);
										}
									}
									catch (e) {
										view_h.setWait(false);
										cont.setError(e);
									}
								}).then(result=>{
									setTimeout(() => view_h.setWait(false), 800);
									resolve(lst);
								})//ende response.then
							}//ende function (response)
						)//ende fetch.then
					}
					catch (e) {
						view_h.setWait(false);
						cont.setError(e)}
				}
				else {resolve(lst)}
			});
		}

		let getById=async (nr)=>{
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

		let getLstByArt=async(nr)=>{
			return new Promise((resolve, reject) => {
				let nLst=[];
				try{
					getList().then(result=>{
						for (let key of lst) {
							if(key.Art === parseInt(nr))
								nLst.push(key)
						};
						resolve(nLst)
					});
				}
				catch (e) {cont.setError(e)}
			});
		}

		let insert=async(m,p,s,a)=>{
			try{
				let val = data(m,p,s,a,1);
				console.log(val);
			}
			catch (e) {cont.setError(e)}
		}

		let update=async(m,p,s,a)=>{
			try{
				let val = data(m,p,s,a,2);
				console.log(val);
			}
			catch (e) {cont.setError(e)}
		}

		let del=async(m,p,s,a)=>{
			try{
				let val = data(m,p,s,a,3);
				console.log(val);
			}
			catch (e) {cont.setError(e)}
		}

		return {getList,getById,getLstByArt,insert,update,del};
	})();

	let data = (m,p,s,a,ac) => {
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
					console.log('data result ',result);
					if(ac>0){ cont.setError(`ID: ${result}`)}
					return result;
				}
			};
			let val =[]
			if(a==0) val = JSON.stringify([{id:m.Id,name:m.Name,beschreibung:m.Desc}])
			else if(a==1) val = JSON.stringify([{id:m.Id,name:m.Name,beschreibung:m.Desc,farbe:m.Farbe,sort:m.sort}])
			else if(a==2) val = JSON.stringify([{id:m.Id,name:m.Name,beschreibung:m.Desc,art:m.Art,bild:m.bild}])
			xhr.send(val);
		}
		catch (e) {
			console.log('data ',e);
			throw e;
		}
	}

	return {artDao,gerDao,egDao};
})();
