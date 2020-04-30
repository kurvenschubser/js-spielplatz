module.exports=( function()  {
	"use strict";
	const sql = require("mssql");
	const dbConDat=require("../dbConData.js");
	let config;
	let getConf=(p)=>{
		let prom = new Promise((resolve,reject) => {
			if (!config) {
				dbConDat.getConData(3).then(
					val => {
						config={
							user:`${val.user}`,
							password:`${val.pwd}`,
							server:`${val.server}`,
							database:p===0?'fitnessNeu':'snipp',
							pool: {max:10,min:0,idleTimeoutMillis:300000},
							options: {encrypt: true,enableArithAbort: true}
						}
						resolve(config);
					},
					rej => {
						reject(rej);
					}
				);
			}
			else{resolve(config)}
		});
		return prom;
	}

	let getQueryStr=(p,a)=>{
		let val=''
		if(p==0){//Fitness App
			if(a==0)//f_arten
				val='select * from f_arten order by name'
			else if(a==1)//f_eigenschaften
				val='select * from f_eigenschaften order by name'
			else if(a==2)//f_geraete
				val='select * from f_geraete order by name'
		}
		else if(p==1){//Programierhilfe App
			if(a==0)//f_sprache
				val='select id,bez,beschr,datum,edit from Lang order by bez'
			else if(a==1)//f_sub_sprache
				val='select id,titel,spr,datum,edit from f_thema order by titel'
			else if(a==2)//f_eintrag
				val='select id,titel,text,lang,sub,sort,datum,edit from f_eintrag order by lang,sub,titel'
		}
		return val
	}

	let getData=(p,a)=>{
		let prom = new Promise((resolve,reject) => {
			try{
				getConf(p).then(val=>{
					sql.connect(val).then(pool => {
						return pool.request().query(getQueryStr(p,a));
					}).then(result => {
						sql.close();
						resolve(result.recordset);
					}, rej=>{
						sql.close();
						reject(rej);
					}).catch(err => {
						sql.close();
						reject(rej)
					})
				},rej=>{
					reject(rej)
				})
			}
			catch(err){reject(err)}
		});
		return prom;
	}

	let insert=(m,p,a)=>{}
	let update=(m,p,a)=>{}
	let del=(m,p,a)=>{}
	return {insert,update,del,getData};
})();
