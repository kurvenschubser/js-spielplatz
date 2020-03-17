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
		}
	}
	catch(e){
		console.log(e?e:'error is null')
	}
	finally{}
}).listen(8889,'localhost')
