/*
Programmierhilfe Stammdaten DAO
*/
"use strict";
let dao=(function(){
	let einDao=(function(){
		//f_eintrag constructor(id,name,desc,val,thema,sub_spr,spr,date,edit)
		let lst=[];		
		async function fillLst(){
			let promise = new Promise((resolve, reject) => {
				fetch(`${ini.CONFOBJ.url}&a=3&ac=0`).then(
				  function(response) {
				  response.text().then(function(text) {
					if(text.startsWith("<p><b>ACHTUNG")){
						cont.setError(text);
						return;
					}
					let doc=JSON.parse(text);
					//console.log(doc);
					//Liste füllen			
					let ge =null;
					for (let key in doc) {
						let obj = doc[key];
						ge = new dom.f_eintrag(obj.id,obj.titel,'-',obj.text,obj.sub_sub,obj.sub,obj.lang,obj.datum,obj.edit);			
						lst.push(ge);
					}			
				  },function(err){cont.setError(text)})
				});
			});
			await promise;			
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getById=(nr)=>{
			for (let key of getList())
				if(key.Id === parseInt(nr)){return key;break;}			
		}		
		let getLstByArt=(nr)=>{			
			let lstN=[];			
			for (let key of getList()) if(key.Sprache === parseInt(nr))lstN.push(key);
			return lstN;
		}
		return {getList: getList,getById: getById,getLstByArt: getLstByArt,fillLst:fillLst};
	})();
	let sprDao=(function(){
		//f_sprache constructor(id,name,desc,date,edit)
		let lst=[];
		async function fillLst(){			
			let promise = new Promise((resolve, reject) => {
				fetch(`${ini.CONFOBJ.url}&a=0&ac=0`).then(
				  function(response) {
				  response.text().then(function(text) {
					if(text.startsWith("<p><b>ACHTUNG")){
						cont.setError(text);
						return;
					}
					let doc=JSON.parse(text);
					//Liste füllen				
					let ge =null;
					for (let key in doc) {				
						let obj = doc[key];
						ge = new dom.f_sprache(obj.id,obj.bez,obj.beschr,obj.datum,obj.edit);									
						lst.push(ge);
													
					}									
				  },function(err){cont.setError(text)})
				});
			});
			await promise;
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}		
		let getById=(nr)=>{
			for (let key of getList())			
				if(key.Id === parseInt(nr)){return key;break;}
		}		
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();
	let subsprDao=(function(){
		//f_sub_thema constructor(id,name,desc,date,edit)
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
					let doc=JSON.parse(text);
					//Liste füllen				
					let ge =null;
					for (let key in doc) {				
						let obj = doc[key];
						ge = new dom.f_sub_thema(obj.id,obj.sub_desc,'-',obj.datum,obj.edit);
						lst.push(ge);
													
					}									
				  },function(err){cont.setError(text)})
				});
			});
			await promise;
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}		
		let getById=(nr)=>{
			for (let key of getList())			
				if(key.Id === parseInt(nr)){return key;break;}
		}		
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();	
	let temDao=(function(){
		//f_thema constructor(id,name,desc,date,edit)
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
					let doc=JSON.parse(text);
					let ge =null;
					for (let key in doc) {
						let obj = doc[key];
						ge = new dom.f_thema(obj.id,obj.titel,'-',obj.dat,obj.edit);				
						lst.push(ge);		
					}						
				  },function(err){cont.setError(text)})
				});
			});
			await promise;
		}			
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getById=(nr)=>{
			for (let key of getList())
				if(key.Id === parseInt(nr)){return key;break;}
		}
		return {getList: getList,getById: getById,fillLst:fillLst};
	})();
	
		
	return {einDao: einDao,sprDao: sprDao,subsprDao:subsprDao,temDao: temDao}; 
})();