//node -version
//v12.16.1
const http = require("http"), fs = require("fs");
http.createServer(function (oreq, ores) {
	"use strict";
	if (!oreq.url.startsWith("/api")) {
		const staticfilepath = __dirname + "/../../Module" + oreq.url;
		fs.readFile(staticfilepath, function(err, data) {
			if (err) {
				ores.writeHead(404);
				ores.end(JSON.stringify(err));
			}
			else {
				ores.writeHead(200);
				ores.end(data);
			}
		});
		return;
	}
	const options = {
    // host to forward to
    host: "localhost",
    // port to forward to
    port: 8888,
    // path to forward to
    path: oreq.url.replace(/^\/api(.*)/, /$1/),
    // request method
    method: oreq.method,
    // headers to send
    headers: oreq.headers
  };

	console.log("options", options);

  const creq = http
    .request(options, pres => {
      // set encoding
      pres.setEncoding("utf8");

      // set http status code based on proxied response
      ores.writeHead(pres.statusCode);

      // wait for data
      pres.on("data", chunk => {
        ores.write(chunk);
      });

      pres.on("close", () => {
        // closed, let"s end client request as well
        ores.end();
      });

      pres.on("end", () => {
        // finished, let"s finish client request as well
        ores.end();
      });
    })
    .on("error", e => {
      // we got an error
      console.log(e.message);
      try {
        // attempt to set error message and http status
        ores.writeHead(500);
        ores.write(e.message);
      } catch (e) {
        // ignore
      }
      ores.end();
    });

  creq.end();
}).listen(8080, "localhost");
console.log("starting static file server on localhost:8080 with proxy to localhost:8888 whenever url starts with '/api'.");

//http://localhost:8888/?p=0&s=4&a=0&ac=0
http.createServer(function (req, res) {
	"use strict";
	const hlp = require("./hlp/hlp.js"), http = require("http"),url = require("url");

	console.log("received request with method " + req.method);
	let getError = (err) => {
		if (err instanceof Error) {
			let msg = err.message;
				let error = { art:'Error', msg:msg };
				return JSON.stringify(JSON.stringify(error));
		}
		else {
			return err;
		}
	}
	try{

		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
		res.writeHead(200,{"Content-Type":"application/json"});
		if ( req.method === "OPTIONS" ) {
			//res.writeHead(200);
			res.end();
			return;
		}

		var q = url.parse(req.url, true).query;
		//p=0 Fitness	=> 	a=0 f_arten 	a=1 f_eigenschaft 	a=2 f_geraete
		//p=1 Proghilfe	=> 	a=0 f_sprache 	a=1 f_sub_sprache 	a=2 f_thema 	a=3 f_eintrag
		//ac action => 		ac = 0 getLst	ac=1 insert 		ac=2 update 	ac=3 delete
		//console.log("q", q);
		const outStr="ACHTUNG!\r\n\r\nDie angeforderten Daten können nicht geliefert werden!"
		if(q.p==null){
			res.write(getError(Error(`${outStr}\r\nDer Parameter p wurde nicht übergeben!`)));
			res.end();
		}
		else if(q.s==null) {
			res.write(getError(Error(`${outStr}\r\nDer Parameter s wurde nicht übergeben!`)));
			res.end();
		}
		else if(q.a==null)	{
			res.write(getError(Error(`${outStr}\r\nDer Parameter a wurde nicht übergeben!`)));
			res.end();
		}
		else if(q.ac==null)	{
			res.write(getError(Error(`${outStr}\r\nDer Parameter ac wurde nicht übergeben!`)));
			res.end();
		}
		else{
			let p=parseInt(q.p);
			let s=parseInt(q.s);
			let a=parseInt(q.a);
			let ac=parseInt(q.ac);
			if(s==4) {//LowDb
				const ms=require("./dao/ldbDao.js");
				if(ac > 0){

					let data = []
					req.on("data", chunk => {
						const jsObj=JSON.parse(chunk);
						for(const x of jsObj){data.push(x)}
					})

					req.on("end", () => {
						let outp;
						try {
							for(const x of data) {

								if(ac==1){
									//insert
									let prom=new Promise((resolve,reject) => {
										let oid= ms.ldbDao.getMaxId(p,a);
										resolve(oid);
									}).then(val => {
										if(val>0){
											x.id=val;
											ms.ldbDao.insert(x,p,a);
											outp +="{"+JSON.stringify(x.id) +"}";
										}
									})
								}
								else if(ac==2){
									//Update
									let prom=new Promise((resolve,reject) => {
										try{
											ms.ldbDao.update(x,p,a);
											outp +="{"+JSON.stringify(x.id) +"}";
											resolve(outp);
										}
										catch(err){
											reject(err);
										}
									})
									.then(
									val => {
											console.log('update promise then  ',val);
											outp = "{"+JSON.stringify(x.id) +"}";
											res.write(`[${outp}]`);
											res.end();
									},
									rej => {
										outp = getError(rej);
										//console.log('update promise last reject  ',rej);
										//console.log('update promise last reject  ',`[${outp}]`);
										res.write(`[${outp}]`);
										res.end();
									});
								}
								else if(ac==3){
									//Delete
									let prom=new Promise((resolve,reject) => {
										ms.ldbDao.del(x,p,a);
										outp +="{"+JSON.stringify(x.id) +"}";
										resolve(outp);
									});
								}

							}//ende for
						}
						catch(err){
							outp = getError(err);
							//console.log('foreach try catch ',outp);
							res.write(outp);
							res.end();
						}
					})
				}
				if(ac==0){
					let prom=new Promise((resolve, reject) => {
						try{
							let val= ms.ldbDao.getData(p,a)
							resolve(val);
						}
						catch(err){
							reject(err);
						}
					}).then(val => {
						//console.log('promise resolve get list ',val);
						res.write(val?JSON.stringify(val):"object is null");
						res.end();
					}, rej => {
						//console.log('promise reject get list ',rej);
						res.write(getError(rej));
						res.end();
					});
				}
			}
			else if(s==3) {//MsSql
				const sql = require("mssql");
				const ms=require("./dao/mssqlDao.js");
				if(ac==0){
					let val;
					sql.connect(ms.mssqlDao.getConf(p)).then(pool => {
						return pool.request().query(ms.mssqlDao.getQueryStr(p,a))
					}).then(result => {
						val=JSON.stringify(result.recordset);
						res.write(val?val:"object is null");
						res.end();
					}).then(()=>{
						sql.close();
					}).catch(err => {throw err})
				}
				else if(ac>0){
					//insertUpdateDelete
					res.write(getError(Error(`${outStr}\r\n>MsSql Insert/Update/Delete sind noch nicht definiert!`)));
					res.end();
				}
				else{
					res.write(getError(Error(`${outStr}\r\n>Die Schnittstelle MsSql ist noch nicht definiert!`)));
					res.end();
				}
			}
			else if(s==2){//MySql
				res.write(getError(Error(`${outStr}\r\n>Die Schnittstelle MySql ist noch nicht definiert!`)));
				res.end();
			}
			else if(s==1){//Xml
				const ms=require("./dao/xmlDao.js");
				if(ac==0){
					let prom=new Promise((resolve, reject) => {
						let val= ms.xmlDao.getData(p,a);
						resolve(val);
					}).then(val => {
						res.write(val?JSON.stringify(val):"object is null");
						res.end();
					});
				}
				else if(ac>0){
					//insertUpdateDelete
					res.write(getError(Error(`${outStr}\r\n>Xml Insert/Update/Delete sind noch nicht definiert!`)));
					res.end();
				}
				else{
					res.write(getError(Error(`${outStr}\r\n>Die Schnittstelle Xml ist noch nicht definiert!`)));
					res.end();
				}
			}
			else{
				res.write(getError(Error(`${outStr}\r\n>Die angefragte Schnittstelle exisitiert nicht!`)));
				res.end();
			}
		}
	}
	catch(err){
		//console.log(err)
		res.write(getError(err));
		res.end();
	}
}).listen(8888,"localhost")
console.log("starting api server localhost:8888");
