//node -version
//v12.16.1
//npm install --save xml2json
//npm install --save xml-js  oder  npm install --global xml-js
//npm install mssql
//http://localhost:8888/?p=0&s=4&a=0&ac=0
"use strict";
const hlp = require('./hlp/hlp'), http = require('http'),url = require('url')
http.createServer(function (req, res) {
	try{
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
		res.writeHead(200,{'Content-Type':'application/json'})
		var q = url.parse(req.url, true).query
		//p=0 Fitness	=> 	a=0 f_arten 	a=1 f_eigenschaft 	a=2 f_geraete
		//p=1 Proghilfe	=> 	a=0 f_sprache 	a=1 f_sub_sprache 	a=2 f_thema 	a=3 f_eintrag
		//ac action => 		ac = 0 getLst	ac=1 insert 		ac=2 update 	ac=3 delete
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
			let p=parseInt(q.p)
			let s=parseInt(q.s)
			let a=parseInt(q.a)
			let ac=parseInt(q.ac)
			if(s==4) {//LowDb
				const ms=require('./dao/ldbDao.js');
				if(ac > 0){
					let data = []

					req.on('data', chunk => {
						const jsObj=JSON.parse(chunk)
						for(const x of jsObj){data.push(x)}
					})

					req.on('end', () => {
						let outp='['
						for(const x of data){
							try{
								if(ac==1){
									//insert
									let prom=new Promise((resolve,reject) => {
										let oid= ms.ldbDao.getMaxId(p,a);
										resolve(oid);
									}).then(function(val){
										if(val>0){
											x.id=val;
											ms.ldbDao.insert(x,p,a)
											outp +='{'+JSON.stringify(x.id) +'}'
										}
									})
								}
								else if(ac==2){
									//Update
									ms.ldbDao.update(x,p,a)
									outp +='{'+JSON.stringify(x.id) +'}'
								}
								else if(ac==3){
									//Delete
									ms.ldbDao.del(x,p,a)
									outp +='{'+JSON.stringify(x.id) +'}'
								}
							}
							catch(err){console.log(err)}
						}
						outp=']';
						res.write(outp)
						res.end()
					})


				}
				if(ac==0){
					let prom=new Promise((resolve, reject) => {
						let val= ms.ldbDao.getData(p,a)
						resolve(val);
					  }).then(function(val){
						res.write(val?JSON.stringify(val):'object is null')	
						res.end()
					});
				}
			}
			else if(s==3) {//MsSql
				const sql = require('mssql')
				const ms=require('./dao/mssqlDao.js');
				if(ac==0){
					let val
					sql.connect(ms.mssqlDao.getConf(p)).then(pool => {
						return pool.request().query(ms.mssqlDao.getQueryStr(p,a))
					}).then(result => {
						val=JSON.stringify(result.recordset);
						res.write(val?val:'object is null')
						res.end()
					}).then(()=>{
						sql.close()
					}).catch(err => {throw err})
				}
				else if(ac>0){
					//insertUpdateDelete
					res.write("<p><b>ACHTUNG</b></p><p>Die Insert/Update/Delete sind noch nicht definiert!<br/><b>Die Seite kann nicht angezeigt werden!</b></p>")
					res.end()
				}
				else{
					res.write("<p><b>ACHTUNG</b></p><p>Die Schnittstelle ist nicht definiert!<br/><b>Die Seite kann nicht angezeigt werden!</b></p>")
					res.end()
				}
			}
			else if(s==2){//MySql
				res.write("<p><b>ACHTUNG</b></p><p>Die Schnittstelle MySql ist noch nicht definiert!<br/><b>Die Seite kann nicht angezeigt werden!</b></p>")
				res.end()
			}
			else if(s==1){//Xml
				const ms=require('./dao/xmlDao.js');
				if(ac==0){
					let prom=new Promise((resolve, reject) => {
						let val= ms.xmlDao.getData(p,a)
						resolve(val);
					 }).then(function(val){
						res.write(val?JSON.stringify(val):'object is null')
						res.end()
					});
				}
				else if(ac>0){
					//insertUpdateDelete
					res.write("<p><b>ACHTUNG</b></p><p>Die Insert/Update/Delete sind noch nicht definiert!<br/><b>Die Seite kann nicht angezeigt werden!</b></p>")
					res.end()
				}
				else{
					res.write("<p><b>ACHTUNG</b></p><p>Die Schnittstelle ist nicht definiert!<br/><b>Die Seite kann nicht angezeigt werden!</b></p>")
					res.end()
				}
			}
			else{
				res.write("<p><b>ACHTUNG</b></p><p>Die angefragte Schnittstelle exisitiert nicht!<br/><b>Die Seite kann nicht angezeigt werden!</b></p>")
				res.end()
			}
		}
	}
	catch(err){console.log(err)}
}).listen(8888,'localhost')

/*
const { Worker,p,a } = require('worker_threads');
//als worker.js speichern
const { workerData, parentPort } = require('worker_threads');
const sum = async (n) => {
  return new Promise((resolve, reject) => {
    let sum = 0;
    for (let i = 0; i < n; i++)  sum += i;
    resolve(sum);
  });
};
const { n } = workerData;
(async () => {
  const result = await sum(n);
  parentPort.postMessage({ result, status: 'Done' });
})();

//in mh.js einbauen
const { Worker } = require('worker_threads');
const n = process.argv[2] || 500;
function runService(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { workerData });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}
async function run() {
  const result = await runService({ n});
  console.log(result.result);
}
setInterval(() => {
  console.log('Hello world');
}, 500);
run().catch((error) => console.error(error));
*/
