exports.xmlDao=(function(){		
	const fs = require('fs'),xmlParser = require('xml2json'),xmlConv =require('xml-js')
	let getData=async function(p,a){
		var json=fs.readFileSync(`xml/db_${p}_${a}.xml`, 'utf8');
		let result = JSON.stringify(xmlConv.xml2js(json, {compact: true, ignoreComment: true, spaces: 4}));			
		return result;
		//res.write(JSON.stringify(result));
		//res.end()
	}
	let getOut=()=>{return 'Hello World!'}
	let getOut2=()=>{return 'und nochmal Hello World!'}
	return {getOut: getOut,getOut2: getOut2,getData:getData};
})();