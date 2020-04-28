module.exports=( function()  {
	"use strict";
	const sql = require("mysql");
	let sqlCon;
	let getSqlCon=(p)=>{
		if (!sqlCon) {
			let dbName=p===0?'fitness':'snipp';
			sqlCon = sql.createConnection({
				host:'localhost',
				user:'root',
				password:'xxx',
				database:dbName
			});
			sqlCon.connect( function (err) {if (err) {sqlCon=null}});
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
				val='select id,titel,spr,datum,edit from f_thema order by titel'
			else if(a==2)//f_eintrag
				val='select id,titel,text,lang,sub,sort,datum,edit from f_eintrag order by lang,sub,titel'
		}
		return val
	}

	let getData=(p,a)=>{
		let prom = new Promise((resolve,reject) => {
			try{
				let con=getSqlCon(p);
				let qur=getQueryStr(p,a);
				con.query(qur,function (error, results, fields) {
					if (error) reject(error);
					resolve(results);
				});
			}
			catch(err){reject(err)}
		});
		return prom;
	}

	let insert=(m,p,a)=>{
		let prom = new Promise((resolve,reject) => {
			try{
				let con=getSqlCon(p);
				let sqlQu;
				if(p==0){
					if(a==0) sqlQu=`INSERT INTO f_arten (id, name,beschreibung) VALUES (${m.id}, '${m.Name}', '${m.Desc}')`;
					else if(a==1) sqlQu=`INSERT INTO f_eigenschaften (id, name,beschreibung,farbe,sortfield) VALUES (${m.id}, '${m.Name}','${m.Desc}','${m.Farbe}',${m.sort})`;
					else if(a==2) sqlQu=`INSERT INTO f_geraete (id, name,beschreibung,art,bild) VALUES (${m.id}, '${m.Name}','${m.Desc}',${m.Art},'${m.bild}')`;
				}
				else if(p==1){
					if(a==0) sqlQu=`INSERT INTO lang (id, bez,beschr,datum,edit) VALUES (${m.id}, '${m.bez}', '${m.beschr}', '${m.datum}', '${m.edit}')`;
					else if(a==1) sqlQu=`INSERT INTO f_thema (id, titel,spr,datum,edit) VALUES (${m.id}, '${m.titel}', ${m.spr}, '${m.datum}', '${m.edit}')`;
					else if(a==2) sqlQu=`INSERT INTO f_eintrag (id, titel,text,lang,sub,sort,datum,edit) VALUES (${m.id}, '${m.titel}', '${m.text}', ${m.lang}, ${m.sub}, ${m.sort}, '${m.datum}', '${m.edit}')`;
				}
				if (sqlQu!=='') {
					con.query(sqlQu, function (err, result) {
						if (err) reject(err);
						console.log("1 record inserted", m.id);
						resolve(`${m.id}`);
					});
				}
			}
			catch(err){reject(err)}
		});
		return prom;
	}

	let update=(m,p,a)=>{}

	let del=(m,p,a)=>{}

	let getMaxId=(p,a)=>{
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
				sqlQu='select IFNULL(max(id),0) from f_thema'
			else if(a==2)//f_eintrag
				sqlQu='select IFNULL(max(id),0) from f_eintrag'
		}
		let prom = new Promise((resolve,reject) => {
			try{
				let con=getSqlCon(p);
				con.query(sqlQu,function (error, results, fields) {
					if (error) reject(error);
					resolve(results);
				});
			}
			catch(err){reject(err)}
		});
		return prom;
	}

	return {insert,update,del,getData};
})();
