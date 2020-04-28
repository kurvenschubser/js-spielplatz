//node -version
//v12.16.1
const http = require("http"), fs = require("fs"),url = require("url"),hlp = require("./hlp/hlp");
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
	console.log("received request with method " + req.method);
	try{
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
		res.writeHead(200,{"Content-Type":"application/json"});
		if ( req.method === "OPTIONS" ) {
			res.end();
			return;
		}

		var q = url.parse(req.url, true).query;
		//p=0 Fitness	=> 	a=0 f_arten 	a=1 f_eigenschaft 	a=2 f_geraete
		//p=1 Proghilfe	=> 	a=0 f_sprache  a=1 f_thema 	a=3 f_eintrag
		//ac action => 	ac = 0 get	ac=1 insert 		ac=2 update 	ac=3 delete
		const outStr="ACHTUNG!\r\n\r\nDie angeforderten Daten können nicht geliefert werden!"
		if(q.p==null){
			res.write(hlp.getError(Error(`${outStr}\r\nDer Parameter p wurde nicht übergeben!`)));
			res.end();
		}
		else if(q.s==null) {
			res.write(hlp.getError(Error(`${outStr}\r\nDer Parameter s wurde nicht übergeben!`)));
			res.end();
		}
		else if(q.a==null)	{
			res.write(hlp.getError(Error(`${outStr}\r\nDer Parameter a wurde nicht übergeben!`)));
			res.end();
		}
		else if(q.ac==null)	{
			res.write(hlp.getError(Error(`${outStr}\r\nDer Parameter ac wurde nicht übergeben!`)));
			res.end();
		}
		else{
			let p=parseInt(q.p);
			let s=parseInt(q.s);
			let a=parseInt(q.a);
			let ac=parseInt(q.ac);
			if(s==5){//###### MongoDB ######
				const ms=require("./dao/mongoDao.js");
				if(ac==0){
					try{
						ms.getData(p,a).then(
							val => {
								res.write(val?JSON.stringify(val):"object is null");
								res.end();
						}, rej =>{
							res.write(hlp.getError(rej));
							res.end();
						});
					}
					catch(err){
						res.write(hlp.getError(err));
						res.end();
					}
				}
				else if(ac>0){
					//insert Update Delete
					res.write(hlp.getError(Error(`${outStr}\r\nMongoDb Insert/Update/Delete sind nicht definiert!`)));
					res.end();
				}
				else{
					res.write(hlp.getError(Error(`${outStr}\r\nDie Schnittstelle MongoDb ist nicht definiert!`)));
					res.end();
				}
			}
			else if(s==4) {//###### LowDb ######
				const ms=require("./dao/ldbDao.js");
				if(ac > 0){
					let data = []
					req.on("data", chunk => {
						const jsObj=JSON.parse(chunk);
						for(const x of jsObj){data.push(x)}
					});
					req.on("end", () => {
						let outp;
						try {
							for(const x of data) {
								if(ac==1){//insert
									let prom=new Promise((resolve,reject) => {
										try{
											let oid= ms.getMaxId(p,a);
											resolve(oid);
										}
										catch(err){reject(err)}
									}).then(
									val => {
										if(val>0){
											x.id=val;
											ms.insert(x,p,a);
											outp +=`{${JSON.stringify(x.id)}}`
										}
									},
									rej=>
									{
										res.write(hlp.getError(rej));
										res.end();
									});
								}
								else if(ac==2){//Update
									let prom=new Promise((resolve,reject) => {
										try{
											ms.update(x,p,a);
											resolve(JSON.stringify(x.id));
										}
										catch(err){reject(err)}
									})
									.then(
									val => {
											res.write(`${val}`);
											res.end();
									},
									rej => {
										res.write(hlp.getError(rej));
										res.end();
									});
								}
								else if(ac==3){//Delete
									let prom=new Promise((resolve,reject) => {
										//try{
											//ms.del(x,p,a);
											//resolve(JSON.stringify(x.id));
										//}
										//catch(err){reject(err)}
										reject('LowDb delete ist noch nicht definiert!');
									}).then(
									val => {
											res.write(`${val}`);
											res.end();
									},
									rej => {
										res.write(hlp.getError(rej));
										res.end();
									});;
								}
							}//ende for
						}
						catch(err){
							outp = hlp.getError(err);
							res.write(outp);
							res.end();
						}
					})
				}
				if(ac==0){//Get
					let prom=new Promise((resolve, reject) => {
						try{
							let val= ms.getData(p,a)
							resolve(val);
						}
						catch(err){reject(err)}
					}).then(
					val => {
						res.write(val?JSON.stringify(val):"object is null");
						res.end();
					},
					rej => {
						res.write(hlp.getError(rej));
						res.end();
					});
				}
			}
			else if(s==3) {//###### MsSql ######
				const ms=require("./dao/mssqlDao.js");
				if(ac==0){
					try{
						ms.getData(p,a).then(
						val => {
							res.write(val?JSON.stringify(val):"object is null");
							res.end();
						}, rej =>{
							res.write(hlp.getError(rej));
							res.end();
						});
					}
					catch(err){
						res.write(hlp.getError(err));
						res.end();
					}
				}
				else if(ac>0){
					//insert Update Delete
					res.write(hlp.getError(Error(`${outStr}\r\nMsSql Insert/Update/Delete sind noch nicht definiert!`)));
					res.end();
				}
				else{
					res.write(hlp.getError(Error(`${outStr}\r\nDie Schnittstelle MsSql ist noch nicht definiert!`)));
					res.end();
				}
			}
			else if(s==2) {//###### MySql ######
				const ms=require("./dao/mysqlDao.js");
				if(ac==0){
					try{
						ms.getData(p,a).then(
							val => {
								res.write(val?JSON.stringify(val):"object is null");
								res.end();
						}, rej =>{
							res.write(hlp.getError(rej));
							res.end();
						});
					}
					catch(err){
						res.write(hlp.getError(err));
						res.end();
					}
				}
				else if(ac>0){
					//insert Update Delete
					res.write(hlp.getError(Error(`${outStr}\r\nMySql Insert/Update/Delete sind noch nicht definiert!`)));
					res.end();
				}
				else{
					res.write(hlp.getError(Error(`${outStr}\r\nDie Schnittstelle MySql ist noch nicht definiert!`)));
					res.end();
				}
			}
			else if(s==1) {//###### Xml ######
				const ms=require("./dao/xmlDao.js");
				if(ac==0){
					let prom=new Promise((resolve, reject) => {
						try{
							let val= ms.getData(p,a)
							resolve(val);
						}
						catch(err){reject(err)}
					}).then(val => {
						res.write(val?JSON.stringify(val):"object is null");
						res.end();
					}, rej => {
						res.write(hlp.getError(rej));
						res.end();
					});
				}
				else if(ac>0){
					//insert Update Delete
					res.write(hlp.getError(Error(`${outStr}\r\nXml Insert/Update/Delete sind noch nicht definiert!`)));
					res.end();
				}
				else{
					res.write(hlp.getError(Error(`${outStr}\r\nDie Schnittstelle Xml ist noch nicht definiert!`)));
					res.end();
				}
			}
			else{
				res.write(hlp.getError(Error(`${outStr}\r\nDie angefragte Schnittstelle exisitiert nicht!`)));
				res.end();
			}
		}
	}
	catch(err){
		res.write(hlp.getError(err));
		res.end();
	}
}).listen(8888,"localhost")
console.log("starting api server localhost:8888");
