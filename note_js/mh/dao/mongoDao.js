module.exports=( function()  {
	"use strict";
	const mgo = require("mongodb").MongoClient;
	let url=`mongodb+srv://js-xxx:xxx@clmichi-vlj76.mongodb.net/test`;
	let getData=async (p,a)=>{
		try{
			let prom = new Promise((resolve,reject) => {
				let dbs=p===0?'fitness':'snip';
				let coll;

				if(p==0){
					if(a==0) coll="f_arten";
					else if(a==1) coll="f_eigenschaften";
					else if(a==2) coll="f_geraete";
				}
				else if(p==1){
					if(a==0) coll="f_sprache";
					else if(a==1) coll="f_sub_thema";
					else if(a==2) coll="f_thema";
					else if(a==3) coll="f_eintrag";
				}

				mgo.connect(url, function(err, db) {
				  if (err) throw err;
				  var dbo = db.db(dbs);
				  dbo.collection(coll).find({}).toArray(function(err, result) {
				    if (err) reject (err);
						resolve(result);
				    db.close();
				  });
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
