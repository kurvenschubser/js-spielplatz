module.exports = ( function () {
  "use strict";
  const low = require('lowdb'),FileAsync = require('lowdb/adapters/FileAsync');
	let adapter,db;
	let insert=async(m,p,a)=>{
		if(m.id > 0){
			await setDefaultDb(p,a);
			if(p==0){
				if(a==0) db.get('f_arten').push(m).write();
				else if(a==1) db.get('f_eigenschaften').push(m).write();
				else if(a==2) db.get('f_geraete').push(m).write();
			}
			else if(p==1){
				if(a==0) db.get('f_sprache').push(m).write();
				else if(a==1) db.get('f_sub_thema').push(m).write();
				else if(a==2) db.get('f_eintrag').push(m).write();
			}
		}
	}

	let update=async (m,p,a)=>{
		await setDefaultDb(p,a);
		if(p==0){
			if(a==0) db.get('f_arten').find({id:m.id}).assign({name:m.name,beschreibung:m.beschreibung}).write();
			else if(a==1) db.get('f_eigenschaften').find({id:m.id}).assign({name:m.name,beschreibung:m.beschreibung,farbe:m.farbe,sort:m.sort}).write();
			else if(a==2) db.get('f_geraete').find({id:m.id}).assign({name:m.name,beschreibung:m.beschreibung,art:m.art,bild:m.bild}).write();
		}
		else if(p==1){
			if(a==0) db.get('f_sprache').find({id:m.id}).assign({bez:m.bez,beschr:m.beschr,datum:m.datum,edit:m.edit}).write();
			else if(a==1) db.get('f_sub_thema').find({id:m.id}).assign({sub_desc:m.sub_desc,spr:m.spr,datum:m.datum,edit:m.edit}).write();
			else if(a==2) db.get('f_eintrag').find({id:m.id}).assign({titel:m.titel,text:m.text,sub:m.sub,lang:m.lang,sort:m.sort,datum:m.datum,edit:m.edit}).write();
		}
	}

	let del=async (m,p,a)=>{
		await setDefaultDb(p,a);
		if(p==0){
			if(a==0) db.get('f_arten').remove({id:m.id}).write();
			else if(a==1) 	db.get('f_eigenschaften').remove({id:m.id})	.write();
			else if(a==2) db.get('f_geraete').remove({id:m.id}).write();
		}
		else if(p==1){
			if(a==0) db.get('f_sprache').remove({id:m.id}).write();
			else if(a==1) db.get('f_sub_thema').remove({id:m.id}).write();
			else if(a==2) db.get('f_eintrag').remove({id:m.id}).write();
		}
	}

	let getData=async (p,a)=>{
		let val;
		await setDefaultDb(p,a);
		if(p==0){
			if(a==0) val=db.get('f_arten').value();
			else if(a==1) val=db.get('f_eigenschaften').value();
			else if(a==2) val=db.get('f_geraete').value();
		}
		else if(p==1){
			if(a==0) val=db.get('f_sprache').value();
			else if(a==1) val=db.get('f_sub_thema').value();
			else if(a==2) val=db.get('f_eintrag').value();
		}
		return JSON.stringify(val);
	}

	let getMaxId=async (p,a)=>{
		let dbVal;
		await setDefaultDb(p,a);
		if(p==0){
			if(a==0) dbVal=db.get('f_arten').value();
			else if(a==1) dbVal=db.get('f_eigenschaften').value();
			else if(a==2) dbVal=db.get('f_geraete').value();
		}
		else if(p==1){
			if(a==0) dbVal=db.get('f_sprache').value();
			else if(a==1) dbVal=db.get('f_sub_thema').value();
			else if(a==2) dbVal=db.get('f_eintrag').value();
		}
		let getMax = (accu, curVal) => accu.id < curVal.id? curVal: accu;
		let lastId = dbVal.reduce(getMax);
		let ret=parseInt(lastId.id) + 1;
		return ret;
	}

	let setDefaultDb=async (p,a)=>{
		adapter = new FileAsync(`./json/db_${p}_${a}.json`);
		db = await low(adapter);
		if(p==0){
			if(a==0) db.defaults({f_arten:[]}).write();
			else if(a==1) db.defaults({f_eigenschaften:[]}).write();
			else if(a==2) db.defaults({f_geraete:[]}).write();
		}
		else if(p==1){
			if(a==0) db.defaults({f_sprache:[]}).write();
			else if(a==1) db.defaults({f_sub_thema:[]}).write();
			else if(a==2) db.defaults({f_eintrag:[]}).write();
		}
	}

	return {getData,insert,update,del,getMaxId};
})();
