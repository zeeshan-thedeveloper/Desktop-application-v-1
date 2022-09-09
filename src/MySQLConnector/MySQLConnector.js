var mysql = require("mysql");
const { getStoredHostMySQLConnectionDetails } = require("../DeviceInfoManager/DeviceInfoManager");
var mysqlConnection=null;
const initConnection = (hostIp, userName, password, port) => {
  return new Promise(async (resolve, reject) => {
    mysqlConnection = mysql.createConnection({
      host: hostIp,
      user: userName,
      password: password,
      port: port,
    });

    mysqlConnection.connect((err) => {
      if (err) {
        // return console.error("error: " + err.message);
        reject(err)
      }
      resolve("Connected")
      console.log("Connected to the MySQL server.");
    });
  });
};

const getMySQLConnection=()=>{
  return new Promise((resolve,reject)=>{
    getStoredHostMySQLConnectionDetails().then((credentials)=>{
      let values = credentials.split("|");
      let con = mysql.createConnection({
        host: values[0],
        user: values[1],
        password: values[2],
        port: values[3],
      });

      con.connect((err) => {
        if (err) {
          // return console.error("error: " + err.message);
          reject(err)
        }
        resolve(con)
        
      });

    }).catch((error)=>{
      console.log("Error while")
    })

    
  })
}

module.exports = {
  initConnection,
  mysqlConnection,
  getMySQLConnection
};
