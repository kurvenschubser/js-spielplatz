module.exports=( function()  {
	"use strict";
	const mgo = require("mongodb").MongoClient;
	let url=`mongodb+srv://js-michi:mG_4711@clmichi-vlj76.mongodb.net/test?retryWrites=true&w=majority`;

	let getData=(p,a)=>{
		let prom = new Promise((resolve,reject) => {
			try{
				let dbs=p===0?'fitness':'snipp';
				let coll;
				let sort;
				if(p==0){
					if(a==0) {coll="f_arten";sort={ name: 1 };}
					else if(a==1) {coll="f_eigenschaften";sort={ name: 1 };}
					else if(a==2) {coll="f_geraete";sort={ name: 1 };}
				}
				else if(p==1){
					if(a==0) {coll="Lang";sort={ bez: 1 };}
					else if(a==1) {coll="f_thema";sort={ sub_desc: 1 };}
					else if(a==2) {coll="f_eintrag";sort={ titel: 1 };}
				}
				mgo.connect(url, function(err, db) {
					if (err) {reject(err);return;}
					if (!db) {reject(Error('Die Verbindung zu MongoDb ist fehlgeschlagen!'));return;}
					var dbo = db.db(dbs);
					if (!dbo) {reject(Error(`Die Verbindung zur MongoDb Datenbank ${dbs} ist fehlgeschlagen!`));return;}
					dbo.collection(coll).find({}).sort(sort).toArray(function(err, result) {
						if (err) {reject (err);return;}
						resolve(result);
						db.close();
					});
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
					if(a==0) sqlQu=`INSERT INTO Lang (id, bez,beschr,datum,edit) VALUES (${m.id}, '${m.bez}', '${m.beschr}', '${m.datum}', '${m.edit}')`;
					else if(a==1) sqlQu=`INSERT INTO f_thema (id, sub_desc,spr,datum,edit) VALUES (${m.id}, '${m.sub_desc}', ${m.spr}, '${m.datum}', '${m.edit}')`;
					else if(a==2) sqlQu=`INSERT INTO f_eintrag (id, titel,text,lang,sub,sort,datum,edit) VALUES (${m.id}, '${m.titel}', '${m.text}', ${m.lang}, ${m.sub}, ${m.sort}, '${m.datum}', '${m.edit}')`;
				}
				if (sqlQu!=='') {
					con.query(sqlQu, function (err, result) {
						if (err) {reject(err);return;}
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

	let del=(m,p,a)=>{
		let prom = new Promise((resolve,reject) => {
			try{
				let con=getSqlCon(p);
				let sqlQu =`delete from `
				if(p==0){//Fitness App
					if(a==0)//f_arten
						sqlQu=`delete from f_arten where Id = ${m.Id}`
					else if(a==1)//f_eigenschaften
						sqlQu=`delete from f_eigenschaften where Id = ${m.Id}`
					else if(a==2)//f_geraete
						sqlQu=`delete from f_geraete where Id = ${m.Id}`
				}
				else if(p==1){//Programierhilfe App
					if(a==0)//f_sprache
						sqlQu=`delete from Lang where Id = ${m.Id}`
					else if(a==1)//f_thema
						sqlQu=`delete from f_thema where Id = ${m.Id}`
					else if(a==2)//f_eintrag
						sqlQu=`delete from f_eintrag where Id = ${m.Id}`
				}
				con.query(sqlQu,function (error, results, fields) {
					if (error) {reject(error);return;}
					resolve(results);
				});
			}
			catch(err){reject(err)}
		});
		return prom;
	}

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
			else if(a==1)//f_thema
				sqlQu='select IFNULL(max(id),0) from f_thema'
			else if(a==2)//f_eintrag
				sqlQu='select IFNULL(max(id),0) from f_eintrag'
		}
		let prom = new Promise((resolve,reject) => {
			try{
				let con=getSqlCon(p);
				con.query(sqlQu,function (error, results, fields) {
					if (error) {reject(error);return;}
					resolve(results);
				});
			}
			catch(err){reject(err)}
		});
		return prom;
	}

	return {insert,update,del,getData};
})();
