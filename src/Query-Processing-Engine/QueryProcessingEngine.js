const { getStoredDatabasePermissions } = require("../DeviceInfoManager/DeviceInfoManager")
const { getMySQLConnection } = require("../MySQLConnector/MySQLConnector")

const executeQuery=(query,databaseName)=>{
    return new Promise((resolve,reject)=>{
        getStoredDatabasePermissions().then((listOfDbPermissions)=>{
            let isAllowed=false;
            let isDbNameProvided=false;
            if(databaseName!=""){
            isDbNameProvided=true;
            JSON.parse(listOfDbPermissions).forEach(element => {
                if(element.dbName==databaseName.toLowerCase()){
                    isAllowed=element.isAllowedToUse
                }
            });

            }else{
                isAllowed=true;
            }

            if(isAllowed){
            getMySQLConnection().then((mysqlConnection)=>{
                //switch to target db.
                //execute query.
                if(isDbNameProvided){
                mysqlConnection.query(`Use ${databaseName}`, function (err, result, fields) {
                    if (err){
                        reject(err)
                    }else{
                        mysqlConnection.query(`${query}`, function (err, result, fields) {
                            if (err){
                                reject(err)
                            }else{
                                resolve(result)
                            }
                        })
                    }
                });
             }else{
                //db Name is not provided
                // mysqlConnection.query(`${query}`, function (err, result, fields) {
                mysqlConnection.query(`${query}`, function (err, result, fields) {
              
                    if (err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                })
             }
            })}else{
                reject("Not allowed to use it.")
            }
        }).catch((error)=>{
            reject(error);
        })

        
    })
}

const validateQueryDatabase=(databaseName)=>{
    return new Promise((resolve,reject)=>{

    })
}


module.exports={
    executeQuery
}