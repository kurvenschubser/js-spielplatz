//node -version
//
//v12.16.1
//
//npm install xml2json
//npm install  xml-js
//npm install lowdb
//npm install mssql
//npm install http
//
//http://localhost:8889/?p=0&s=4&a=0&ac=2
//
const http = require('http'),url = require('url')
http.createServer(function (req, res) {
	try{
		var q = url.parse(req.url, true).query;
		//p=Programm	s=Speicher	a=art	ac=Action= 	ac=0 Get	ac=1 insert ac=2 update ac=3 delete
		//p=0 Fitness	=> 	a=0 f_arten 	a=1 f_eigenschaft 	a=2 f_geraete
		//p=1 Proghilfe	=> 	a=0 f_sprache 	a=1 f_sub_sprache 	a=2 f_thema 	a=3 f_eintrag
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
		res.writeHead(200,{'Content-Type':'application/json'})
		if(q.p==null){
			res.write('<p><b>ACHTUNG</b></p><p>Der Parameter p wurde nicht übergeben!<br/><b>Die Seite kann nicht angezeigt werden!</b></p>')
			res.end()
		}
		else if(q.s==null) {
			res.write('<p><b>ACHTUNG</b></p><p>Der Parameter s wurde nicht übergeben!<br/><b>Die Seite kann nicht angezeigt werden!</b></p>')
			res.end()
		}
		else if(q.a==null)	{
			res.write('<p><b>ACHTUNG</b></p><p>Der Parameter a wurde nicht übergeben!<br/><b>Die Seite kann nicht angezeigt werden!</b></p>')
			res.end()
		}
		else if(q.ac==null)	{
			res.write('<p><b>ACHTUNG</b></p><p>Der Parameter ac wurde nicht übergeben!<br/><b>Die Seite kann nicht angezeigt werden!</b></p>')
			res.end()
		}
		else{
			let val='';
			let p=parseInt(q.p)
			let s=parseInt(q.s)
			let a=parseInt(q.a)
			let ac=parseInt(q.ac)
			//lowdb
			const ms=require('./dao/ldbDao.js')
			if(ac>0){
				let data = []
				req.on('data', chunk => {
					const jsObj=JSON.parse(chunk)
					for(const x of jsObj){data.push(x)}
				})
				if(ac===1){
					//insert
					req.on('end', () => {
						let outp=''
						let prom=new Promise((resolve,reject) => {
							for(const x of data){
								let prom_tmp=new Promise((resolve,reject) => {
									let oid= ms.ldbDao.getMaxId(p,a);
									resolve(oid);
								}).then(function(val){
									//console.log(val)
									if(val>0){
										x.id=val;
										ms.ldbDao.insert(x,p,a)
										outp +=JSON.stringify(x) +'<br/>'
									}
									else{
										outp +=`id=0 Das Element kann nicht angelegt werden!<br/> ${x.name}`;
									}
								})
							}
							setTimeout(() => resolve(outp), 1000);
						}).then(resolve=>{
							res.write(`<p><b>ACHTUNG</b></p><p>Insert</b><br/>${resolve}</p>`)
							res.end()
						});//ende Promise prom
					})
				}
				else if(ac===2){
					//update
					req.on('end', () => {
						let outp=''
						let prom=new Promise((resolve,reject) => {
							for(const x of data){
								ms.ldbDao.update(x,p,a)
								outp +=JSON.stringify(x.id) +'<br/>'
							}
							setTimeout(() => resolve(outp), 1000);
						}).then(resolve=>{
							res.write(`<p><b>ACHTUNG</b></p><p>Update</b><br/>${resolve}</p>`)
							res.end()
						});//ende Promise prom
					})
				}
				else if(ac===3){
					//delete
					req.on('end', () => {
						let outp=''
						let prom=new Promise((resolve,reject) => {
							for(const x of data){
								//console.log(x)
								ms.ldbDao.del(x,p,a);
								outp +=JSON.stringify(x.id) +'<br/>'
							}
							setTimeout(() => resolve(outp), 1000);
						}).then(resolve=>{
							res.write(`<p><b>ACHTUNG</b></p><p>Delete OK!</b><br/>${resolve}</p>`)
							res.end()
						});//ende Promise prom
					})
				}
			}
			else if(ac===0){
				//GET
				let prom=new Promise((resolve,reject) => {
					let val=ms.ldbDao.getData(p,a);
					setTimeout(() => resolve(val), 1000);
				}).then(val=>{
					//console.log(val);
					res.write(val?val:'object is null')
					res.end()
				})
			}
			else{
				res.write('<p><b>ACHTUNG</b></p><p>Der Parameter ac istfalsch</b></p>')
				res.end()
			}

			/*
			//XML
			const ms=require('./dao/xmlDao.js');
			(async () => {
				let val=await ms.xmlDao.getData(0,2);
				console.log(val);
				res.write(val?val:'object is null')
				res.end()
			})();
			*/

			/*
			//MsSql
			const ms=require('./dao/msDao.js');
			var promise = new Promise(function(resolve, reject) {
					  //if (isAnyNegative()) {reject(Error("Negatives not supported"));   }
				let val=ms.msDao.getData(0,0);
				resolve(val)
			});
			promise.then(function(result){
				res.write(result?JSON.stringify(result):'object is null')
				res.end()
			});

			(async () => {
				let val=await ms.msDao.getData(p,a);
				console.log(val?val:'object is null');
				res.write(val?val:'object is null')
				res.end()
			})();

			const config={user:'michi',password:'wer',server:'MYDELL-PC',database:p==0?'fitnessNeu':'snip',pool: {max:10,min:0,idleTimeoutMillis:300000},options: {encrypt: true,enableArithAbort: true}}
			//const sqlcon=new sql.ConnectionPool(config);
			sql.connect(config).then(pool => {
				if(parseInt(p)==0){//Fitness App
					if(parseInt(a)==0)//f_arten
						val='select * from f_arten order by name'
					else if(parseInt(a)==1)//f_eigenschaften
						val='select * from f_eigenschaften order by name'
					else if(parseInt(a)==2)//f_geraete
						val='select * from f_geraete order by name'
				}
				else if(parseInt(p)==1){//Programierhilfe App
					return []
				}
				//return pool.request().input('input_parameter', sql.Int, value).query('select * from mytable where id = @input_parameter')
				return pool.request().query(val)
			})
			.then(result => {
					val=result.recordset?JSON.stringify(result.recordset):'object is null'
					res.write(val)
					res.end()
			})
			.then(()=>{
				console.log('con close')
				sql.close()})
			.catch(e => {console.log(e)})
			*/

			/*
			var promise = new Promise(function(resolve, reject) {
					  //if (isAnyNegative()) {reject(Error("Negatives not supported"));   }
				let val=ms.msDao.getData(0,0);
				resolve(val)
			});
			console.log(promise);
			res.write(promise?promise:'object is null')
			res.end()
			*/

			/*
			//CREATE JSON LOW_DB from MsSql
			//const sql = require('mssql');
			const ms=require('./dao/ldbDao.js')
			const config={user:'juhi',password:'ihuj1234',server:'ARBEIT',database:p==0?'fitnessNeu':'snip',pool: {max:10,min:0,idleTimeoutMillis:300000},options: {encrypt: true,enableArithAbort: true}};
			const sqlcon=new sql.ConnectionPool(config);
			sqlcon.connect().then(pool => {
				if(p==0){//Fitness App
					if(a==0)//f_arten
						return pool.query('select * from f_arten order by name');
					else if(a==1)//f_eigenschaften
						return pool.query('select * from f_eigenschaften order by name');
					else if(a==2)//f_geraete
						return pool.query('select * from f_geraete order by name');
				}
				else if(p==1){//Programierhilfe App
					if(a==0)//f_sprache
						return pool.query('select id,bez,beschr,datum,edit from Lang order by bez');
					else if(a==1)//f_sub_sprache
						return pool.query('select id,sub_desc,spr,datum,edit from Sub_lang order by sub_desc');
					else if(a==2)//f_thema
						return pool.query('select id,titel,sub_lang,dat,edit from Sub_sub_lang order by titel');
					else if(a==3)//f_eintrag
						return pool.query('select tc.id,ss.titel,tc.text,tc.sub_sub,sl.id sub,l.id lang,tc.sort,tc.datum,tc.edit from Text_content tc inner join Sub_sub_lang ss on ss.id=tc.sub_sub inner join Sub_lang sl on sl.Id = ss.sub_lang inner join Lang l on l.id = sl.spr order by ss.titel');
				}
			}).then(result => {
				//val=JSON.stringify(result.recordset);
				for(let m of result.recordset){ms.ldbDao.insert(m,p,a)}
				val=ms.ldbDao.getData(p,a)
				console.log(val)
				res.write(val?JSON.stringify(val):'object is null')
				res.end()
			}).catch(e => {console.log(e)})

			try{
				let err=new Error('blabla')
				console.error(err.message);
				res.write(err?err.message:'error is null')
				res.end()
			}
			catch(e){
				res.write(e?e.message:'error is null')
				res.end()
			}
			*/

		}
	}
	catch(e){
		console.log(e?e:'error is null')
	}
	finally{}
}).listen(8889,'localhost')
