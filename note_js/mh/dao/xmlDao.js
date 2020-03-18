"use strict";
exports.xmlDao=(function(){
	const fs = require('fs'),xmlParser = require('xml2json'),xmlConv =require('xml-js')
	let getData=async (p,a)=>{
		let json=fs.readFileSync(`xml/db_${p}_${a}.xml`, 'utf8');
		let result = JSON.stringify(xmlConv.xml2js(json, {compact: true, ignoreComment: true, spaces: 4}));
		return result;
	}
	let insert=async (m,p,a)=>{}
	let update=async (m,p,a)=>{}
	let del=async (m,p,a)=>{}
	return {insert:insert,update:update,del:del,getData:getData};
})();
