module.exports=( function()  {
	"use strict";
	const sql = require("mssql");
	let getConf=(p)=>{
		const config={user:'michi',password:'wer',server:'ARBEIT',database:p==0?'fitnessNeu':'snip',pool: {max:10,min:0,idleTimeoutMillis:300000},options: {encrypt: true,enableArithAbort: true}}
		return config;
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
				val='select id,sub_desc,spr,datum,edit from Sub_lang order by sub_desc'
			else if(a==2)//f_thema
				val='select id,titel,sub_lang,dat,edit from Sub_sub_lang order by titel'
			else if(a==3)//f_eintrag
				val='select tc.id,ss.titel,tc.text,tc.sub_sub,sl.id sub,l.id lang,tc.sort,tc.datum,tc.edit from Text_content tc inner join Sub_sub_lang ss on ss.id=tc.sub_sub inner join Sub_lang sl on sl.Id = ss.sub_lang inner join Lang l on l.id = sl.spr order by ss.titel'
		}
		return val
	}

	let getData=async (p,a)=>{
		try{
			let prom = new Promise((resolve,reject) => {
				sql.connect(getConf(p)).then(pool => {
					return pool.request().query(getQueryStr(p,a));
				}).then(result => {
					sql.close();
					resolve(result.recordset);
				}, rej=>{
					reject(rej);
				}).catch(err => {reject(rej)})
			});
			return prom;
		}
		catch(err){
			throw err;
		}
	}

	let insert=async (m,p,a)=>{}
	let update=async (m,p,a)=>{}
	let del=async (m,p,a)=>{}
	return {insert,update,del,getData};
})();
