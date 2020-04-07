/*
Fitness Stammdaten Lokal DAO
*/
let dao=(function(){
	"use strict";

	let artDao=(function(){
		let lst=[];

		let getList=async ()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					let fart = new dom.f_arten(1,'Kraft','Kraftsport Muskelaufbau');
					lst.push(fart);
					fart = new dom.f_arten(2,'Cardio','Ausdauer Sport');
					lst.push(fart);
					resolve(lst)
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

		return {getList,getById};
	})();

	let egDao=(
		function(){
		let lst=[];

		let getList=async ()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					let eg = new dom.f_eigenschaft(1,'Kg','Kilogramm',hlp.rgb2hex(255,255,0),5);
					lst.push(eg);
					eg = new dom.f_eigenschaft(8,'Dauer','Minuten',hlp.rgb2hex(255,115,15),13);
					lst.push(eg);
					resolve(lst)
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

		return {getList,getById};
	})();

	let gerDao=(function(){
		let lst=[];

		let getList=async ()=>{
			return new Promise((resolve, reject) => {
				if(lst===null || lst.length ==0){
					let ge = new dom.f_geraete(7,'Seilzug','Seilzugbeschreibung',1,'seilzug.jpg');
					lst.push(ge);
					ge = new dom.f_geraete(41,'Langhantel','-',2,'langhantel.jpg');
					lst.push(ge);
					resolve(lst)
				}
				else { resolve(lst) }
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

		return {getList,getById,getLstByArt};
	})();

	let insert=async (m,p,s,a)=>{}

	let update=async (m,p,s,a)=>{}

	let del=async (m,p,s,a)=>{}

	return {artDao,gerDao,egDao,insert,update,del};
})();
