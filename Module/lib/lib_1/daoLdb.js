/*
Programmierhilfe Stammdaten DAO
*/
"use strict";
let dao=(function(){	
	let einDao=(function(){
		//f_eintrag constructor(id,name,desc,val,thema,sub_spr,spr,date,edit)
		let lst=[];		
		async function fillLst(){
			fetch(`${ini.CONFOBJ.url}&a=3&ac=0`).then(
			  function(response) {
			  response.text().then(function(text) {
				if(text.startsWith("<p><b>ACHTUNG")){
					cont.setError(text);
					return;
				}
				let doc=JSON.parse(text);
				//Liste füllen			
				let ge =null;
				for (let val of JSON.parse(doc)){
					ge = new dom.f_eintrag(val.id,val.titel,'-',val.text,val.sub_sub,val.sub,val.lang,val.datum,val.edit);			
					lst.push(ge);
				}			
			  },function(err){cont.setError(text)})
			});	
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
		return {getList: getList,getById: getById,getLstByArt: getLstByArt,fillLst:fillLst,insert:insert,update:update,del:del}
	})();
	let sprDao=(function(){
		//f_sprache constructor(id,name,desc,date,edit)
		let lst=[];
		async function fillLst(){			
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
				for (let val of JSON.parse(doc)){
					ge = new dom.f_sprache(val.id,val.bez,val.beschr,val.datum,val.edit);									
					lst.push(ge);											
				}									
			  },function(err){cont.setError(text)})
			});
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}		
		let getById=(nr)=>{
			for (let key of getList())			
				if(key.Id === parseInt(nr)){return key;break;}
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
		return {getList: getList,getById: getById,fillLst:fillLst,insert:insert,update:update,del:del};
	})();
	let subsprDao=(function(){
		//f_sub_thema constructor(id,name,desc,date,edit)
		let lst=[];
		async function fillLst(){			
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
				for (let val of JSON.parse(doc)){
					ge = new dom.f_sub_thema(val.id,val.sub_desc,'-',val.datum,val.edit);
					lst.push(ge);												
				}									
			  },function(err){cont.setError(text)})
			});
		}
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}		
		let getById=(nr)=>{
			for (let key of getList())			
				if(key.Id === parseInt(nr)){return key;break;}
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
		return {getList: getList,getById: getById,fillLst:fillLst,insert:insert,update:update,del:del};
	})();	
	let temDao=(function(){
		//f_thema constructor(id,name,desc,date,edit)
		let lst=[];
		async function fillLst(){
			fetch(`${ini.CONFOBJ.url}&a=2&ac=0`).then(		  
			  function(response) {
			  response.text().then(function(text) {				
				if(text.startsWith("<p><b>ACHTUNG")){
					cont.setError(text);
					return;
				}
				let doc=JSON.parse(text);
				let ge =null;
				for (let val of JSON.parse(doc)){
					ge = new dom.f_thema(val.id,val.titel,'-',val.dat,val.edit);				
					lst.push(ge);		
				}						
			  },function(err){cont.setError(text)})
			});
		}			
		let getList=()=>{
			if(lst===null || lst.length ==0) fillLst();
			return lst;
		}
		let getById=(nr)=>{
			for (let key of getList())
				if(key.Id === parseInt(nr)){return key;break;}
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
		return {getList: getList,getById: getById,fillLst:fillLst,insert:insert,update:update,del:del};
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
		if(p==1){
			if(a==0) data =JSON.stringify([{id:m.Id,name:m.Name,desc:m.Desc}])			
			else if(a==1) data =JSON.stringify([{id:m.Id,bez:m.Name,desc:m.Desc,datum:m.Datum,edit:m.Edit}])			
			else if(a==2)data =JSON.stringify([{id:m.Id,titel:m.Name,desc:m.Desc,datum:m.Datum,edit:m.Edit}])
			else if(a==3)data =JSON.stringify([{id:m.Id,name:m.Name,titel:m.Desc,text:m.Text,sub:m.Thema,sub_sub:m.Sub_Sprache,lang:m.Sprache,sort:m.sort,datum:m.Datum,edit:m.Edit}])
			this.Id=id;
			this.Name=name;
			this.Desc=desc;
			this.Datum=date;
			this.Edit=edit;
		}		
		xhr.send(data);  
		return result;                                
	}	
		
	return {einDao: einDao,sprDao: sprDao,subsprDao:subsprDao,temDao: temDao}; 
})();