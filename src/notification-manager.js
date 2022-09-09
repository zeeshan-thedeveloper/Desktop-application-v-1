const Electrolytic = require("electrolytic");
const emitter = require("./event-engine/Emiters");
const events = require("./event-engine/Events");
var io = require("socket.io-client");
const { initEvents } = require("./event-engine/Listeners");
const { executeQuery } = require("./Query-Processing-Engine/QueryProcessingEngine");
// const { CENTRAL_API } = require('./request-manager/urls');
initEvents();

const electrolytic = Electrolytic({ appKey: "OmGci2murwT1NKqd791x" });

electrolytic.on("token", (token) => {
  console.log("got a token", token);
  global.device_Id = token;
  emitter.emit(events.UPDATE_DEVICE_ID);
});
let index=0
const queryResolver = (payload) => {
  return new Promise((resolve, reject) => {

    //executing query.
    executeQuery(payload.query,payload.databaseName).then((internalServerResponse)=>{
      console.log('internalServerResponse',internalServerResponse)
      let v = Math.round(new Date().getTime() / 1000);
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let tableRow = ` <tr style="margin-top: 8%">
      <th scope="row">${index + 1}</th>
      <td>${payload.databaseName}</td>
      <td>${payload.query}</td>
      <td>${date+" | "+time}</td>
      <td>${JSON.stringify(internalServerResponse)}</td>
      </tr>`;
      $("#liveLogTable").append(tableRow);    
      const convertResponse = JSON.stringify({
        ...payload,
        response:internalServerResponse,
        hostDeviceId: global.device_Id,
      });
      
      index++;
  
      resolve(convertResponse);

    }).catch((error)=>{
      console.log("Error while executing the query",error);
      let v = Math.round(new Date().getTime() / 1000);
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let tableRow = ` <tr style="margin-top: 8%">
      <th scope="row">${index + 1}</th>
      <td>${payload.databaseName}</td>
      <td>${payload.query}</td>
      <td>${date+" | "+time}</td>
      <td style="max-width:2rem">${JSON.stringify}</td>
      </tr>`;
      $("#liveLogTable").append(tableRow);    
      const convertResponse = JSON.stringify({
        ...payload,
        response:error,
        hostDeviceId: global.device_Id,
      });
      
      index++;
  
      resolve(convertResponse);

    });

    
  });
};

electrolytic.on("push", (payload) => {
  console.log("got push notification", payload);
  var socket = io.connect("https://central-api-ldh.herokuapp.com", {
    reconnect: true,
  });
  // joining/connecting to the stream
  socket.on("connect", function () {
    getStoredHostId().then((hostId) => {
      queryResolver(JSON.parse(payload)).then((resolvedData) => {
        console.log("connected having host id", hostId);
        console.log("sending data as response", resolvedData);
        console.log("Id while connecting:", socket.id);
        socket.emit("joining", hostId, global.device_Id, resolvedData);
      });
    });
  });

  getStoredHostId().then((hostId) => {
    // lets register for getting data back here.
    socket.on(
      hostId,
      function (data) {
        console.log("Data through stream : ", data);
        //After getting query,databaseName and request Id .. let send response back after
        const streamData = JSON.parse(data);
        // sending response back through socket
        queryResolver(streamData).then((resolvedData) => {
          console.log("sending data as response", resolvedData);
          socket.emit("resolvingMySQL", resolvedData);
        });
      },
      2000
    );
    socket.on(
      hostId + "_pingChannel",
      function (data) {
        console.log("Data through ping channel stream : ", data);
        socket.emit("joining", hostId, global.device_Id, null);
      },
      2000
    );
  });
});
