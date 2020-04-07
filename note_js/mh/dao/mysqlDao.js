module.exports=( function()  {
	"use strict";
	const sql = require("mysql");
	let sqlCon;
	let getSqlCon=(p)=>{
		if (!sqlCon) {
			sqlCon = sql.createConnection({
				host:'localhost',
				user:'root',
				password:'',
				database:p===0?'fitness':'snip'
			});
			console.log('set sqlCon ');
			sqlCon.connect( function (err) {});
		}
		return sqlCon;
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
				let con=getSqlCon(p);
				let qur=getQueryStr(p,a);
				con.query(qur,function (error, results, fields) {
					if (error) reject(error);
					//console.log('con.query',results,fields);
					resolve(results);
				});
			});
			return prom;
		}
		catch(err){
			throw err;
		}
	}

	let insert=async (m,p,a)=>{
		try{
			let prom = new Promise((resolve,reject) => {
				let con=getSqlCon(p);
				let sqlQu;
				if(p==0){
					if(a==0) sqlQu=`INSERT INTO f_arten (id, name,beschreibung) VALUES (${m.id}, '${m.Name}', '${m.Desc}')`;
					else if(a==1) sqlQu=`INSERT INTO f_eigenschaften (id, name,beschreibung,farbe,sortfield) VALUES (${m.id}, '${m.Name}','${m.Desc}','${m.Farbe}',${m.sort})`;
					else if(a==2) sqlQu=`INSERT INTO f_geraete (id, name,beschreibung,art,bild) VALUES (${m.id}, '${m.Name}','${m.Desc}',${m.Art},'${m.bild}')`;
				}
				else if(p==1){
					if(a==0) sqlQu=`INSERT INTO lang (id, bez,beschr,datum,edit) VALUES (${m.id}, '${m.bez}', '${m.beschr}', ${m.datum}, ${m.edit})`;
					else if(a==1) sqlQu=`INSERT INTO sub_lang (id, sub_desc,spr,datum,edit) VALUES (${m.id}, '${m.sub_desc}', ${m.spr}, ${m.datum}, ${m.edit})`;
					else if(a==2) sqlQu=`INSERT INTO sub_sub_lang (id, sub_lang,datum,titel,dat,edit) VALUES (${m.id}, ${m.desc}, '${m.datum}', '${m.titel}', ${m.dat}, ${m.edit})`;
					else if(a==3) sqlQu=`INSERT INTO text_content (id, text,sub_sub,sort,datum,edit) VALUES (${m.id}, '${m.text}', ${m.sub_sub}, ${m.sort}, ${m.datum}, ${m.edit})`;
				}
				if (sqlQu!=='') {
					con.query(sqlQu, function (err, result) {
						if (err) reject(err);
						console.log("1 record inserted", m.id);
						resolve(`${m.id}`);
					});
				}
			});
			return prom;
		}
		catch(err){
			throw err;
		}
	}

	let update=async (m,p,a)=>{}

	let del=async (m,p,a)=>{}

	let getMaxId=async (p,a)=>{
		let sqlQu=''
		if(p==0){//Fitness App
			if(a==0)//f_arten
				sqlQu='select IFNULL(max(id),0)  from f_arten'
			else if(a==1)//f_eigenschaften
				sqlQu='select IFNULL(max(id),0) from f_eigenschaften'
			else if(a==2)//f_geraete
				sqlQu='select IFNULL(max(id),0)  from f_geraete'
		}
		else if(p==1){//Programierhilfe App
			if(a==0)//f_sprache
				sqlQu='select IFNULL(max(id),0) from Lang'
			else if(a==1)//f_sub_sprache
				sqlQu='select IFNULL(max(id),0) from Sub_lang'
			else if(a==2)//f_thema
				sqlQu='select IFNULL(max(id),0) from Sub_sub_lang'
			else if(a==3)//f_eintrag
				sqlQu='select IFNULL(max(id),0) from Text_content'
		}
		console.log(sqlQu);
		try{
			let prom = new Promise((resolve,reject) => {
				let con=getSqlCon(p);
				con.query(sqlQu,function (error, results, fields) {
					if (error) reject(error);
					console.log('con.query',results);
					resolve(results);
				});
			});
			return prom;
		}
		catch(err){
			throw err;
		}
	}

	return {insert,update,del,getData};
})();
