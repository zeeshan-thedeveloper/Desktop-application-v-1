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
    console.log(
      "Successfully Written host mysql connection details  to File.",
      value
    );
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

const storeDatabasePermissions = (value) => {
  fs.writeFile(__dirname + "/DatabasePermissions.json", value, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written database permissions  to File.", value);
  });
};

const getStoredDatabasePermissions = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      __dirname + "/DatabasePermissions.json",
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

const storeServiceManagerEmailAddress = (value) => {
  fs.writeFile(__dirname + "/ServiceManagerEmailAddress.txt", value, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written database permissions  to File.", value);
  });
};

const getStoredServiceManagerEmailAddress = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      __dirname + "/ServiceManagerEmailAddress.txt",
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
  storeDatabasePermissions,
  getStoredDatabasePermissions,
  storeServiceManagerEmailAddress,
  getStoredServiceManagerEmailAddress
};
