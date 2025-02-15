// button listeners

const {
  storeHostId,
  storeHostUserName,
  getStoredHostUserName,
  getStoredHostId,
  getStoredHostMySQLConnectionDetails,
  storeHostMySQLConnectionDetails,
  getStoredDatabasePermissions,
  storeDatabasePermissions,
  storeServiceManagerEmailAddress,
  getStoredServiceManagerEmailAddress,
} = require("./DeviceInfoManager/DeviceInfoManager");

const Events = require("./event-engine/Events");
const {
  initConnection,
  mysqlConnection,
  getMySQLConnection,
} = require("./MySQLConnector/MySQLConnector");
const { sendRequestToCentralAPI } = require("./request-manager/requestManager");
const {
  GET_UNIQUE_ID,
  LOAD_SERVICE_PROVIDERS_LIST,
  ADD_HOST_IN_REQUEST_LIST,
  REMOVE_HOST_FROM_REQUEST_LIST,
  IS_HOST_CONNECTED,
} = require("./request-manager/requestUrls");
const CENTRAL_API = require("./request-manager/urls");

const mysqlSettingScreenAlertPlaceHolder = document.getElementById(
  "mysqlSettingScreenAlertPlaceHolder"
);

let listOfServiceManagers = [];

$(document).ready(function () {
  setUp();
})

const setUp=()=>{
  if(navigator.onLine){
  // here we will hide the screens and check some important details.
  $("#dashboardScreen").hide();
  $("#manageDatabases_subScreen").hide();
  $("#localServer_subScreen").hide();
  $("#liveLogs_subScreen").hide();
  $("#internalServerErrorScreen").hide();
  $("#checkingUpLocalSqlServerConnection").show();
  $("#nameSettingScreen").show();
  //setting visibility of sub screens and connectivity of mysql
  getStoredHostUserName()
    .then((hostName) => {
      //already stored host name
      $("#hostName").text("Host Name : "+hostName)
      getStoredHostMySQLConnectionDetails()

        .then((data) => {
          $("#checkingUpLocalSqlServerConnection").show();
          $("#continueBtnAndInputField").hide();
          $("#errorMsg_nameSettingScreen").hide();
          let values = data.split("|");
          console.log("values", values);
          $("#checkingSystemReq").text("Checking up sql server");
          initConnection(values[0], values[1], values[2], values[3])
            .then((success) => {
              $("#listOfServiceManagers_subScreen").show();
              $("#mysqlSettings_subScreen").hide();

              enableOrDisableAllDashboardOptions(false);
              updateDeviceId();
              //connection is created...
              setTimeout(() => {
                $("#checkingSystemReq").text("Make test connection");
              }, 2000);
              setTimeout(() => {
                $("#checkingSystemReq").text("Connection Successful");
              }, 4000);
              setTimeout(() => {
                $("#checkingSystemReq").text(
                  "Redirecting to dashboard please wait."
                );
              }, 6000);
              setTimeout(() => {
                // $("#continueBtn").trigger("click");
                $("#checkingUpLocalSqlServerConnection").hide();
                $("#continueBtnAndInputField").hide();
                $("#nameSettingScreen").hide();
                $("#errorMsg_nameSettingScreen").hide();
                $("#listOfServiceManagers_btn").trigger("click");
                $("#dashboardScreen").show(200);
              }, 8000);
            })
            .catch((error) => {
              $("#listOfServiceManagers_subScreen").hide();
              $("#mysqlSettings_subScreen").show();
              enableOrDisableAllDashboardOptions(true);
              alertForMySQLSettingScreen(
                "Error :" + JSON.stringify(error),
                "warning"
              );
              //redirect to .. show up the message the could not create connection with sql server...
              $("#errorMsg_nameSettingScreen").show();
            });
        })
        .catch((error) => {
          //disable all buttons .. except mysql setting .. and open mysql by default screen
          $("#listOfServiceManagers_subScreen").hide();
          $("#mysqlSettings_subScreen").show();
          $("#continueBtnAndInputField").hide();
          $("#errorMsg_nameSettingScreen").hide();
          enableOrDisableAllDashboardOptions(true);
          updateDeviceId();
          //connection is created...
          setTimeout(() => {
            $("#checkingSystemReq").text("Making test connection");
          }, 2000);
          setTimeout(() => {
            $("#checkingSystemReq").text(
              "No credentials for making connection found.. Please store from dashboard and make connection"
            );
          }, 4000);
          setTimeout(() => {
            // $("#checkingSystemReq").text(
            //   "Redirecting to dashboard please wait."
            // );
          }, 6000);
          setTimeout(() => {
            // $("#continueBtn").trigger("click");
            $("#checkingUpLocalSqlServerConnection").hide();
            $("#continueBtnAndInputField").hide();
            $("#nameSettingScreen").hide();
            $("#listOfServiceManagers_btn").trigger("click");
            $("#dashboardScreen").show(200);
          }, 8000);
        });
    })
    .catch((error) => {
      //no stored host name
      $("#checkingUpLocalSqlServerConnection").hide();
      $("#continueBtnAndInputField").show();
      $("#errorMsg_nameSettingScreen").hide();
      //name will be taken from user
    });

  $("#loadingGifForListOfServicecManagers").hide();
  $("#noServiceProviderFound").hide();

  }else{
    showInternetConnectionErrorScreen();
  }
};

const enableOrDisableAllDashboardOptions = (value) => {
  $("#listOfServiceManagers_btn").attr("disabled", value);
  $("#manageDatabases_btn").attr("disabled", value);
  $("#localServer_btn").attr("disabled", value);
  $("#liveLogs_btn").attr("disabled", value);
};

$("#checkNowBtn").click(()=>{
  setUp();
})

$("#continueBtn").click(() => {
  var userName = $("#userNameFld").val();
  $("hostName").text(userName)
  getStoredHostMySQLConnectionDetails()
    .then((data) => {
      $("#checkingUpLocalSqlServerConnection").hide();
      $("#continueBtnAndInputField").hide();
      $("#nameSettingScreen").hide();
      $("#errorMsg_nameSettingScreen").hide();

      let values = data.split("|");
      console.log("values", values);
      $("#checkingSystemReq").text("Checking up sql server");
      initConnection(values[0], values[1], values[2], values[3])
        .then((success) => {
          $("#listOfServiceManagers_subScreen").show();
          $("#mysqlSettings_subScreen").hide();

          enableOrDisableAllDashboardOptions(false);
          updateDeviceId();
          //connection is created...
          setTimeout(() => {
            $("#checkingSystemReq").text("Make test connection");
          }, 2000);
          setTimeout(() => {
            $("#checkingSystemReq").text("Connection Successful");
          }, 4000);
          setTimeout(() => {
            $("#checkingSystemReq").text(
              "Redirecting to dashboard please wait."
            );
          }, 6000);
          setTimeout(() => {
            $("#checkingUpLocalSqlServerConnection").hide();
            $("#continueBtnAndInputField").hide();
            $("#nameSettingScreen").hide();
            $("#errorMsg_nameSettingScreen").hide();
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
          }, 8000);
        })
        .catch((error) => {
          $("#listOfServiceManagers_subScreen").hide();
          $("#mysqlSettings_subScreen").show();

          enableOrDisableAllDashboardOptions(true);
          alertForMySQLSettingScreen(
            "Error :" + JSON.stringify(error),
            "warning"
          );
          //redirect to .. show up the message the could not create connection with sql server...
          $("#checkingUpLocalSqlServerConnection").hide();
          $("#errorMsg_nameSettingScreen").show();
        });
    })
    .catch((error) => {
      //disable all buttons .. except mysql setting .. and open mysql by default screen
      $("#listOfServiceManagers_subScreen").hide();
      $("#mysqlSettings_subScreen").show();

      enableOrDisableAllDashboardOptions(true);

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
});

//sub screen buttons.
$("#refreshListOfServiceManagers").click(() => {
  $("#listOfServiceManagers_btn").trigger("click");
});

$("#listOfServiceManagers_btn").click(() => {
  $("#listOfServiceManagers_subScreen").show(200);
  $("#mysqlSettings_subScreen").hide("slow", function () {});
  $("#manageDatabases_subScreen").hide("slow", function () {});
  $("#localServer_subScreen").hide("slow", function () {});
  $("#liveLogs_subScreen").hide("slow", function () {});
  $("#alreadyConnected_subScreen").hide();
  //lets render data into it.

  
  getStoredServiceManagerEmailAddress()
    .then((email) => {
      getStoredHostId()
        .then((hostId) => {
          $("#loadingGifForListOfServicecManagers").show();
          $("#noServiceProviderFound").hide();
          sendRequestToCentralAPI("POST", IS_HOST_CONNECTED, {
            hostId: hostId,
            serviceManagerEmail: email,
          })
            .then((resp) => resp.json())
            .then((response) => {
              console.log("response", response);
              if(response.responseMessage=="Already Requested"){
                $("#makingConnectionRequest_subScreen").hide();
                $("#alreadyConnected_subScreen").show();
                $("#alreadyConnected_subScreen").text("Already connected to :  "+email);
              }else{

              }
            });
        })
        .catch((error) => {
          console.log(error)
          // alert("Could not find host id");
        });
    })
    .catch((error) => {
      // alert("Could not find host name");
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
      let values = data.split("|");
      console.log("values", values);
      initConnection(values[0], values[1], values[2], values[3])
        .then((success) => {
          $("#mysqlConnectionStatus").text("Connected");
          //set values.
          $("#hostIp").val(values[0]);
          $("#dbUserName").val(values[1]);
          $("#dbUserPassword").val(values[2]);
          $("#dbServerPort").val(values[3]);
        })
        .catch((error) => {
          $("#mysqlConnectionStatus").text("Not connected");
        });
    })
    .catch((error) => {
      $("#mysqlConnectionStatus").text("Not Connected");
    });
});

let dataToPopulate = [];

$("#manageDatabases_btn").click(() => {
  $("#listOfServiceManagers_subScreen").hide("slow", function () {});
  $("#mysqlSettings_subScreen").hide("slow", function () {});
  $("#manageDatabases_subScreen").show(200);
  $("#localServer_subScreen").hide("slow", function () {});
  $("#liveLogs_subScreen").hide("slow", function () {});

  //load all databases
  let defaultDb = [
    "information_schema",
    "mysql",
    "performance_schema",
    "sakila",
    "sys",
    "world",
  ];

  getMySQLConnection()
    .then((connection) => {
      connection.query("Show databases", function (err, result) {
        if (err) throw err;

        let targetDbs = [];

        result.forEach((item) => {
          if (!defaultDb.includes(item.Database)) targetDbs.push(item.Database);
        });

        //Now lets populate it.

        getStoredDatabasePermissions()
          .then((databasePermissions) => {
            let dbPermissions = JSON.parse(databasePermissions);
            console.log(dbPermissions);
            dataToPopulate = [];
            $("#listOfAllDatabases").find("tr:gt(0)").remove();
            targetDbs.forEach((dbName, index) => {
              let status = false;
              let isFound = false;

              dbPermissions.forEach((storedDb) => {
                if (storedDb.dbName == dbName) {
                  status = storedDb.isAllowedToUse;
                  isFound = true;
                }
              });

              if (isFound) {
                dataToPopulate.push({
                  dbName: dbName,
                  isAllowedToUse: status,
                });
              } else {
                dataToPopulate.push({
                  dbName: dbName,
                  isAllowedToUse: false,
                });
              }
            });
            console.log("dataToPopulate", dataToPopulate);
            dataToPopulate.forEach((item, index) => {
              let tableRow = ` <tr style="margin-top: 8%">
              <th scope="row">${index + 1}</th>
              <td>${item.dbName}</td>
              <td>${item.isAllowedToUse === true ? "Yes" : "No"}</td>
              <td>
              <button
              type="button"
              style="width: 8rem"
              class="btn btn-outline-primary"
              id="connectBtn"
              onClick = ${
                item.isAllowedToUse == true
                  ? `setDisableSharingOfDb(${index})`
                  : `setEnableSharingOfDb(${index})`
              } 
            >
            ${item.isAllowedToUse == true ? "Restrict" : "Allow"}
            </button>
              </td>
              </tr>`;

              $("#listOfAllDatabases").append(tableRow);
            });
          })

          .catch((error) => {
            //there was not data or no file .. so in this case will write it.
            let dbPermissions = [];
            $("#listOfAllDatabases").find("tr:gt(0)").remove();
            targetDbs.forEach((dbName, index) => {
              let tableRow = ` <tr style="margin-top: 8%">
            <th scope="row">${index + 1}</th>
            <td>${dbName}</td>
            <td>${"No"}</td>
            <td>
            <button
            type="button"
            style="width: 5rem;"
            
            class="btn btn-outline-primary"
            id="allowBtn"
            onClick =setEnableSharingOfDb(${index})
          >
              Allow
          </button>
            </td>
            </tr>`;
              $("#listOfAllDatabases").append(tableRow);

              dbPermissions.push({
                dbName: dbName,
                isAllowedToUse: false,
              });
            });

            storeDatabasePermissions(JSON.stringify(dbPermissions));
          });
      });
    })
    .catch((error) => {
      console.log("error in loading mysql connection object");
    });
});

const setEnableSharingOfDb = (index) => {
  let target = dataToPopulate[index];
  dataToPopulate[index].isAllowedToUse = true;
  storeDatabasePermissions(JSON.stringify(dataToPopulate));
  $("#manageDatabases_btn").trigger("click");
};

const setDisableSharingOfDb = (index) => {
  let target = dataToPopulate[index];
  dataToPopulate[index].isAllowedToUse = false;
  storeDatabasePermissions(JSON.stringify(dataToPopulate));
  $("#manageDatabases_btn").trigger("click");
};

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

$("#testMySQLCon_btn").click(() => {
  var hostIp = $("#hostIp").val();
  var dbUserName = $("#dbUserName").val();
  var dbUserPassword = $("#dbUserPassword").val();
  var dbServerPort = $("#dbServerPort").val();
  initConnection(hostIp, dbUserName, dbUserPassword, dbServerPort)
    .then((success) => {
      $("#mysqlConnectionStatus").text("Connected");
      alertForMySQLSettingScreen("Great..!! Connection created.", "success");
    })
    .catch((error) => {
      alertForMySQLSettingScreen("Error :" + JSON.stringify(error), "warning");
      // $("#mysqlConnectionStatus").text("Not connected, test failed");
      $("#mysqlConnectionStatus").text("Disconnected");
    });
});

$("#mySQLConForm").submit(function (event) {
  event.preventDefault();
  var hostIp = $("#hostIp").val();
  var dbUserName = $("#dbUserName").val();
  var dbUserPassword = $("#dbUserPassword").val();
  var dbServerPort = $("#dbServerPort").val();
  storeHostMySQLConnectionDetails(
    hostIp + "|" + dbUserName + "|" + dbUserPassword + "|" + dbServerPort
  );
  initConnection(hostIp, dbUserName, dbUserPassword, dbServerPort)
    .then((success) => {
      alertForMySQLSettingScreen("Great..!! Connection created.", "success");
      enableOrDisableAllDashboardOptions(false);
      $("#mysqlConnectionStatus").text("Connected");
    })
    .catch((error) => {
      alertForMySQLSettingScreen("Error :" + JSON.stringify(error), "warning");
      enableOrDisableAllDashboardOptions(true);
      $("#mysqlConnectionStatus").text("Disconnected");
    });
});

//connection requests handlers
$("#connectToServiceManager_btn").click(()=>{
  let email = $("#serviceManagerEmail").val();
  makeConnectionRequest(email);
  // $("#serviceResponseWhileServiceManagerConnection").text("");
})
const makeConnectionRequest = (email) => {
  let target = listOfServiceManagers[index];
  // alert("connect"+target.email);
  getStoredHostId().then((hostId) => {
    getStoredHostUserName().then((hostName) => {
      $("#pleaseWaitModal_msg").text("Please wait we are connecting to admin");
      $("#pleaseWaitModal").modal("show");
      sendRequestToCentralAPI("POST", ADD_HOST_IN_REQUEST_LIST, {
        hostDeviceId: global.device_Id,
        adminEmail:email,
        hostName: hostName + "@" + email,
        hostId: hostId, //which we got from server
      }).then(
        async (success) => {
          const data = await success.json();
          console.log("data of connection response : ",data)
          emitter.emit(Events.UPDATE_DEVICE_ID);
          $("#pleaseWaitModal_msg").text(data.responseMessage);
          storeServiceManagerEmailAddress(email);
          setTimeout(() => {
            $("#serviceResponseWhileServiceManagerConnection").text(data.responseMessage);
            $("#pleaseWaitModal").modal("hide");
          }, 3000);
        },
        (error) => {
          // alert(error);
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
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  mysqlSettingScreenAlertPlaceHolder.append(wrapper);
};

const updateDeviceId = () => {
  setInterval(() => {
    emitter.emit(Events.UPDATE_DEVICE_ID);
  }, 60000);
};


const showInternetConnectionErrorScreen=()=>{
  $("#dashboardScreen").hide();
  $("#internalServerErrorScreen").show();
  $("#continueBtnAndInputField").hide();
  $("#errorMsg_nameSettingScreen").hide();
  $("#continueBtnAndInputField").hide();
  $("#checkingUpLocalSqlServerConnection").hide();
  $("#nameSettingScreen").hide();
}


window.addEventListener("offline", (event) => {
  showInternetConnectionErrorScreen();
})


window.addEventListener("online", (event) => {
  console.log("online now")
  setUp(); 
})