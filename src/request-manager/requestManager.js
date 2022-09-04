const CENTRAL_API = "https://central-api-ldh.herokuapp.com";
// const CENTRAL_API = "http://localhost:3003";
// const CENTRAL_API = require("../request-manager/urls")

const fetch = require("node-fetch");
const sendRequestToCentralAPI = (requestType, requestRoute, requestData,authToken=null) => {
  return new Promise(async function (resolve, reject) {
    if (requestType == "GET") {
      // when request is of GET type
  
     const resposne = await fetch(`${CENTRAL_API}${requestRoute}`)
     resolve(resposne);

    } else if (requestType == "POST") {
     
      // When request is of type post
      // fetch(`${CENTRAL_API}${requestRoute}`, {
        const response = await fetch(`${CENTRAL_API}${requestRoute}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              // 'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': '*',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(requestData) // body data type must match "Content-Type" header
          });
          // const resp = await response.json()
          resolve(response)     
    }
  }).catch((error)=>{
    reject(error);
  });
};

module.exports = { sendRequestToCentralAPI };
