const Server_url = "https://central-api-ldh.herokuapp.com";
// const Server_url = "http://localhost:3003";

// const fetch = require("node-fetch");
const sendResquestToCentralAPI = (requestType, requestRoute, requestData,authToken=null) => {
  return new Promise(async function (resolve, reject) {
    if (requestType == "GET") {
      // when request is of GET type
      fetch(`${Server_url}${requestRoute}`)
        .then((res) => res.json())
        .then((response) => {
          resolve(response);
        });
    } else if (requestType == "POST") {
     
      // When request is of type post
      // fetch(`${Server_url}${requestRoute}`, {
        const response = await fetch(`${Server_url}${requestRoute}`, {
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

module.exports = { sendResquestToCentralAPI };
