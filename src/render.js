// button listeners

const {
  storeHostId,
  storeHostUserName,
  getStoredHostUserName,
  getStoredHostId,
  getStoredHostMySQLConnectionDetails,
  storeHostMySQLConnectionDetails,
} = require("./DeviceInfoManager/DeviceInfoManager");
// const emitter = require("./event-engine/Emiters");
const Events = require("./event-engine/Events");
const { initConnection } = require("./MySQLConnector/MySQLConnector");
const { sendRequestToCentralAPI } = require("./request-manager/requestManager");
const {
  GET_UNIQUE_ID,
  LOAD_SERVICE_PROVIDERS_LIST,
  ADD_HOST_IN_REQUEST_LIST,
  REMOVE_HOST_FROM_REQUEST_LIST,
} = require("./request-manager/requestUrls");
const CENTRAL_API = require("./request-manager/urls");


const mysqlSettingScreenAlertPlaceHolder = document.getElementById('mysqlSettingScreenAlertPlaceHolder')

let listOfServiceManagers = [];

$(document).ready(function () {
  // here we will hide the screens and check some important details.
  $("#dashboardScreen").hide();
  //setting visibility of sub screens and connectivity of mysql

  getStoredHostMySQLConnectionDetails().then((data)=>{

    let values = data.split("|")
      console.log("values",values)
      initConnection(values[0],values[1],values[2],values[3]).then((success)=>{
        $("#listOfServiceManagers_subScreen").show();
        $("#mysqlSettings_subScreen").hide();
        enableOrDisableAllDashboardOptions(false);
      }).catch((error)=>{
        $("#listOfServiceManagers_subScreen").hide();
        $("#mysqlSettings_subScreen").show();
        enableOrDisableAllDashboardOptions(true);
        alertForMySQLSettingScreen('Error :'+JSON.stringify(error), 'warning');
      })
   
  }).catch((error)=>{
    //disable all buttons .. except mysql setting .. and open mysql by default screen
    $("#listOfServiceManagers_subScreen").hide();
    $("#mysqlSettings_subScreen").show();
    enableOrDisableAllDashboardOptions(true);
  })

  $("#dashboardScreen").hide();
  // $("#listOfServiceManagers_subScreen").show();
  // $("#mysqlSettings_subScreen").hide();
  $("#manageDatabases_subScreen").hide();
  $("#localServer_subScreen").hide();
  $("#liveLogs_subScreen").hide();

  $("#loadingGifForListOfServicecManagers").hide();
  $("#noServiceProviderFound").hide();
});


const enableOrDisableAllDashboardOptions=(value)=>{
$('#listOfServiceManagers_btn').attr("disabled", value);
$('#manageDatabases_btn').attr("disabled", value);
$('#localServer_btn').attr("disabled", value);
$('#liveLogs_btn').attr("disabled", value);
}

$("#continueBtn").click(() => {
  var userName = $("#userNameFld").val();
  getStoredHostUserName()
    .then((userName) => {
      $("#nameSettingScreen").hide("slow", function () {
        // hide with callback function
        // $("#dashboardScreen").show(200);
        console.log("nameSettingScreen is hidden");
        $("#dashboardScreen").show(200);
      });
    })
    .catch((error) => {
      storeHostUserName(userName);
      $("#nameSettingScreen").hide("slow", function () {
        $("#dashboardScreen").show(200);
      });
    });
});

//sub screen buttons.

$("#listOfServiceManagers_btn").click(() => {

  $("#listOfServiceManagers_subScreen").show(200);
  $("#mysqlSettings_subScreen").hide("slow", function () {});
  $("#manageDatabases_subScreen").hide("slow", function () {});
  $("#localServer_subScreen").hide("slow", function () {});
  $("#liveLogs_subScreen").hide("slow", function () {});

  //lets render data into it.

  $("#my_table_1").find("tr:gt(0)").remove();
  getStoredHostUserName().then((hostName)=>{
    getStoredHostId()
    .then((hostId) => {
      $("#loadingGifForListOfServicecManagers").show();
      $("#noServiceProviderFound").hide();
      sendRequestToCentralAPI("POST", LOAD_SERVICE_PROVIDERS_LIST, {
        hostId: hostId,
        hostName:hostName
      })
        .then((resp) => resp.json())
        .then((response) => {
          console.log("response", response);
          listOfServiceManagers = response.responsePayload;
          response.responsePayload.forEach((manager, index) => {
            let tableRow = ` <tr style="margin-top: 8%">
    <th scope="row">${index + 1}</th>
    <td>${manager.email}</td>
    <td>${
      manager.connectedHostList[0] != null ? manager.connectedHostList[0].isConnected : "Not Requested"
    }</td>
    <td>
      <button
        type="button"
        style="width: 8rem"
        class="btn btn-outline-primary"
        id="connectBtn"
        onClick= ${
          manager.connectedHostList[0] != null 
            ? `makeDisConnectionRequest(${index})`
            : `makeConnectionRequest(${index})`
        }
      >
      ${manager.connectedHostList[0] != null ? (manager.connectedHostList[0].isConnected=="Pending"  || manager.connectedHostList[0].isConnected=="Dis-connect" ) ? 'Withdraw' : 'Dis-connect' : "Make Request"}
      </button>
    </td>
  </tr>`;
            $("#my_table_1").append(tableRow);

            // $("#my_table_1").show();
          });
          $("#loadingGifForListOfServicecManagers").hide();
          if(response.responsePayload.length==0){
            //show no host found
            $("#noServiceProviderFound").show();
          }
        });
    })
    .catch((error) => {
      alert("Could not find host id");
    });
  }) .catch((error) => {
    alert("Could not find host name");
  });
  
});

$("#mysqlSettings_btn").click(() => {

  $("#listOfServiceManagers_subScreen").hide("slow", function () {});
  $("#mysqlSettings_subScreen").show(200);
  $("#manageDatabases_subScreen").hide("slow", function () {});
  $("#localServer_subScreen").hide("slow", function () {});
  $("#liveLogs_subScreen").hide("slow", function () {});

  //load details of connection from local file.. if found no file or no data then will set connection status accordingly.
  getStoredHostMySQLConnectionDetails()
    .then((data) => {
      //lets make try to make connection using already stored data.
      // console.log("Stored connection data", data);
      let values = data.split("|")
      console.log("values",values)
      initConnection(values[0],values[1],values[2],values[3]).then((success)=>{
        $("#mysqlConnectionStatus").text("Connected");
        //set values.
      $("#hostIp").val(values[0]);
      $("#dbUserName").val(values[1]);
      $("#dbUserPassword").val(values[2]);
      $("#dbServerPort").val(values[3]);

      }).catch((error)=>{
        $("#mysqlConnectionStatus").text("Not connected");
      })
    })
    .catch((error) => {
      $("#mysqlConnectionStatus").text("Not Connected");
    });
});

$("#manageDatabases_btn").click(() => {
  $("#listOfServiceManagers_subScreen").hide("slow", function () {});
  $("#mysqlSettings_subScreen").hide("slow", function () {});
  $("#manageDatabases_subScreen").show(200);
  $("#localServer_subScreen").hide("slow", function () {});
  $("#liveLogs_subScreen").hide("slow", function () {});
});

$("#localServer_btn").click(() => {
  $("#listOfServiceManagers_subScreen").hide("slow", function () {});
  $("#mysqlSettings_subScreen").hide("slow", function () {});
  $("#manageDatabases_subScreen").hide("slow", function () {});
  $("#localServer_subScreen").show(200);
  $("#liveLogs_subScreen").hide("slow", function () {});
});
$("#liveLogs_btn").click(() => {
  $("#listOfServiceManagers_subScreen").hide("slow", function () {});
  $("#mysqlSettings_subScreen").hide("slow", function () {});
  $("#manageDatabases_subScreen").hide("slow", function () {});
  $("#localServer_subScreen").hide("slow", function () {});
  $("#liveLogs_subScreen").show(200);
});

$('#testMySQLCon_btn').click(()=>{
  var hostIp = $("#hostIp").val();
  var dbUserName = $("#dbUserName").val();
  var dbUserPassword = $("#dbUserPassword").val();
  var dbServerPort = $("#dbServerPort").val();
  initConnection(hostIp,dbUserName,dbUserPassword,dbServerPort).then((success)=>{
    $("#mysqlConnectionStatus").text("Connected");
    alertForMySQLSettingScreen('Great..!! Connection created.', 'success');
  }).catch((error)=>{
    alertForMySQLSettingScreen('Error :'+JSON.stringify(error), 'warning');
    // $("#mysqlConnectionStatus").text("Not connected, test failed");
  })
})

$("#mySQLConForm").submit(function (event) {
  event.preventDefault();
  var hostIp = $("#hostIp").val();
  var dbUserName = $("#dbUserName").val();
  var dbUserPassword = $("#dbUserPassword").val();
  var dbServerPort = $("#dbServerPort").val();
  storeHostMySQLConnectionDetails(hostIp+"|"+dbUserName+"|"+dbUserPassword+"|"+dbServerPort);
  initConnection(hostIp,dbUserName,dbUserPassword,dbServerPort).then((success)=>{
    alertForMySQLSettingScreen('Great..!! Connection created.', 'success');
    enableOrDisableAllDashboardOptions(false);
  }).catch((error)=>{
    alertForMySQLSettingScreen('Error :'+JSON.stringify(error), 'warning');
    enableOrDisableAllDashboardOptions(true);
  })
});

//connection requests handlers

const makeConnectionRequest = (index) => {
  let target = listOfServiceManagers[index];
  // alert("connect"+target.email);
  getStoredHostId().then((hostId) => {
    getStoredHostUserName().then((hostName) => {
      $("#pleaseWaitModal_msg").text("Please wait we are connecting to admin");
      $("#pleaseWaitModal").modal("show");
      sendRequestToCentralAPI("POST", ADD_HOST_IN_REQUEST_LIST, {
        hostDeviceId: global.device_Id,
        adminId: target.id,
        hostName: hostName + "@" + target.email,
        hostId: hostId, //which we got from server
      }).then(
        async (success) => {
          const data = await success.json();
          emitter.emit(Events.UPDATE_DEVICE_ID)
          $("#pleaseWaitModal_msg").text(data.responseMessage);
          setTimeout(() => {
            $("#pleaseWaitModal").modal("hide");
          }, 3000);
        },
        (error) => {
          alert(error);
        }
      );
    });
  });
};

const makeDisConnectionRequest = (index) => {
  let target = listOfServiceManagers[index];

  getStoredHostId().then((hostId) => {
    $("#pleaseWaitModal_msg").text(
      "Please wait we are dis connecting from admin"
    );
    $("#pleaseWaitModal").modal("show");
    sendRequestToCentralAPI("POST", REMOVE_HOST_FROM_REQUEST_LIST, {
      adminId: target.id,
      hostId: hostId, //which we got from server
      status: "Decline",
    }).then(
      async (success) => {
        const data = await success.json();
        console.log(data);
        $("#pleaseWaitModal_msg").text(data.responseMessage);
        setTimeout(() => {
          $("#pleaseWaitModal").modal("hide");
        }, 3000);
      },
      (error) => {
        alert(error);
      }
    );
  });
};

// Alerts

const alertForMySQLSettingScreen = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')


  mysqlSettingScreenAlertPlaceHolder.append(wrapper)
}