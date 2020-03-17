"use strict";
exports.xmlDao=(function(){			
	const fs = require('fs'),xmlParser = require('xml2json'),xmlConv =require('xml-js')
	let getData=async function(p,a){
		var json=fs.readFileSync(`xml/db_${p}_${a}.xml`, 'utf8');
		let result = JSON.stringify(xmlConv.xml2js(json, {compact: true, ignoreComment: true, spaces: 4}));			
		return result;
	}
	let insert=async function(m,p,a){}
	let update=async function(m,p,a){}
	let del=async function(m,p,a){}
	return {insert:insert,update:update,del:del,getData:getData};
})();