// var store = require('store');
var fs = require("fs");
const storeHostId = (value) => {
  fs.writeFile(__dirname + "/hostId.txt", value, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written host id to File.", value);
  });
};

const getStoredHostId = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/hostId.txt", "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      // console.log("value retrieved back : ",data)
      resolve(data);
    });
  });
};

const storeHostUserName = (value) => {
  fs.writeFile(__dirname + "/hostUserName.txt", value, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written host user name to File.", value);
  });
};

const getStoredHostUserName = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/hostUserName.txt", "utf-8", (err, data) => {
      if (err || data.length == 0) {
        reject(null);
      }
      // console.log("value retrieved back : ",data)
      resolve(data);
    });
  });
};

const storeHostMySQLConnectionDetails = (value) => {
  fs.writeFile(__dirname + "/hostMySQLConnectionDetails.txt", value, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written host mysql connection details  to File.", value);
  });
};

const getStoredHostMySQLConnectionDetails = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      __dirname + "/hostMySQLConnectionDetails.txt",
      "utf-8",
      (err, data) => {
        if (err || data.length == 0) {
          reject(null);
        }
        // console.log("value retrieved back : ",data)
        resolve(data);
      }
    );
  });
};

module.exports = {
  storeHostId,
  getStoredHostId,
  storeHostUserName,
  getStoredHostUserName,
  storeHostMySQLConnectionDetails,
  getStoredHostMySQLConnectionDetails,
};
