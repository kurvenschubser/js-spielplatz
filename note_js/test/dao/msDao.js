exports.msDao=(function(){
	const sql = require('mssql');
	sql.on('error', err => {
		console.log(err)
	})
	let getData=async function(p,a){




		const config={user:'michi',password:'wer',server:'ARBEIT',database:parseInt(p)==0?'fitnessNeu':'snip',pool: {max:10,min:0,idleTimeoutMillis:300000},options: {encrypt: true,enableArithAbort: true}};
		//const sqlcon=new sql.ConnectionPool(config);
		let val;
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
			val=JSON.stringify(result.recordset)
			sql.close()
			return val
		})
		//.then(()=>{sql.close()})
		.catch(e => {throw e})
		//return val
	}
	let getOut=()=>{return 'Hello World!'}
	let getOut2=()=>{return 'und nochmal Hello World!'}
	return {getOut: getOut,getOut2: getOut2,getData:getData};
})();
