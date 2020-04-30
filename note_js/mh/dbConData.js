module.exports = (function () {
  "use strict";
  let conObj;

  let getConData=(s)=>{
    let prom = new Promise((resolve,reject) => {
      try{
        conObj={};
        if (s===5) {//MongoDb
          conObj.user="xxx";
          conObj.pwd="xxx";
          conObj.server="xxx";
        }
        else if (s===3) {//MsSql
          conObj.user="xxx";
          conObj.pwd="xxx";
          conObj.server="xxx";
        }
        else if (s===2) {//MySql
          conObj.user="xxx";
          conObj.pwd="xxx";
          conObj.server="xxx";
        }
        if (!conObj) {
          conObj.user="";
          conObj.pwd="";
          conObj.server="";
        }
        resolve(conObj);
      }
      catch(err){reject(err)}
    });
    return prom;
  }

  return {getConData};
})();
