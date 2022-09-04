// button listeners

const {
  storeHostId,
  storeHostUserName,
  getStoredHostUserName,
  getStoredHostId,
} = require("./DeviceInfoManager/DeviceInfoManager");
const { sendRequestToCentralAPI } = require("./request-manager/requestManager");
const {
  GET_UNIQUE_ID,
  LOAD_SERVICE_PROVIDERS_LIST,
  ADD_HOST_IN_REQUEST_LIST,
  REMOVE_HOST_FROM_REQUEST_LIST,
} = require("./request-manager/requestUrls");
const CENTRAL_API = require("./request-manager/urls");

let listOfServiceManagers=[];

$(document).ready(function () {
  // here we will hide the screens and check some important details.
  $("#dashboardScreen").hide();

  //setting visibility of sub screens
  $("#dashboardScreen").hide();

  $("#listOfServiceManagers_subScreen").show();
  $("#mysqlSettings_subScreen").hide();
  $("#manageDatabases_subScreen").hide();
  $("#localServer_subScreen").hide();
  $("#liveLogs_subScreen").hide();

  $("#loadingGifForListOfServicecManagers").hide();
});

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
$("#my_table_1")
  .find("#connectBtn")
  .click(function () {
    // console.log(this)
    alert("hm");
    // var id = $(this).closest("tr").find("td:eq(2)").text();
    // alert(id)
  });

$("#listOfServiceManagers_btn").click(() => {
 
  $("#listOfServiceManagers_subScreen").show(200);
  $("#mysqlSettings_subScreen").hide("slow", function () {});
  $("#manageDatabases_subScreen").hide("slow", function () {});
  $("#localServer_subScreen").hide("slow", function () {});
  $("#liveLogs_subScreen").hide("slow", function () {});

  //lets render data into it.
  $("#my_table_1").find("tr:gt(0)").remove();

  getStoredHostId()
    .then((hostId) => {
      $("#loadingGifForListOfServicecManagers").show();
      $("#my_table_1").hide();
      sendRequestToCentralAPI("POST", LOAD_SERVICE_PROVIDERS_LIST, {
        hostId: hostId,
      })
        .then((resp) => resp.json())
        .then((response) => {
          console.log("response", response);
          listOfServiceManagers = response.responsePayload
          response.responsePayload.forEach((manager, index) => {
            let tableRow = ` <tr style="margin-top: 8%">
    <th scope="row">${index + 1}</th>
    <td>${manager.email}</td>
    <td>${
      manager.connectedHostList[0] != null ? "Connected" : "Not Connected"
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
      ${manager.connectedHostList[0] != null ? "Dis-Connect" : "Connect"}
      </button>
    </td>
  </tr>`;
            $("#my_table_1").append(tableRow);
            $("#loadingGifForListOfServicecManagers").hide();
            $("#my_table_1").show();
          });
        });
    })
    .catch((error) => {
      alert("Could not find host id");
    });

});
$("#mysqlSettings_btn").click(() => {
  $("#listOfServiceManagers_subScreen").hide("slow", function () {});
  $("#mysqlSettings_subScreen").show(200);
  $("#manageDatabases_subScreen").hide("slow", function () {});
  $("#localServer_subScreen").hide("slow", function () {});
  $("#liveLogs_subScreen").hide("slow", function () {});
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

const makeConnectionRequest = (index) => {
  let target = listOfServiceManagers[index];
  // alert("connect"+target.email);
  getStoredHostId().then((hostId)=>{
    getStoredHostUserName().then((hostName)=>{
      $("#pleaseWaitModal_msg").text("Please wait we are connecting to admin")
      $("#pleaseWaitModal").modal("show");
      sendRequestToCentralAPI("POST",ADD_HOST_IN_REQUEST_LIST,{
        hostDeviceId: global.device_Id,
        adminId: target.id,
        hostName:hostName+"@"+target.email, 
        hostId:hostId, //which we got from server
      }).then(async (success)=>{
        const data = await success.json();
        console.log(data);
        
        $("#pleaseWaitModal_msg").text(data.responseMessage)
        // $("#infoModal").modal("show");
        setTimeout(() => {
          $("#pleaseWaitModal").modal("hide");
        }, 3000);
     
      },(error)=>{  
        alert(error)
      })
    })

    
  })
  
};

const makeDisConnectionRequest = (index) => {
  let target = listOfServiceManagers[index];
  // alert("dis"+target.email);

  getStoredHostId().then((hostId)=>{
    $("#pleaseWaitModal_msg").text("Please wait we are dis connecting from admin")
    $("#pleaseWaitModal").modal("show");
    sendRequestToCentralAPI("POST",REMOVE_HOST_FROM_REQUEST_LIST,{
      adminId: target.id,
      hostId:hostId, //which we got from server
      status:"Decline"
    }).then(async (success)=>{
      const data = await success.json();
      console.log(data);
      $("#pleaseWaitModal_msg").text(data.responseMessage)
      // $("#infoModal").modal("show");
      setTimeout(() => {
        $("#pleaseWaitModal").modal("hide");
      }, 3000);
   
    },(error)=>{  
      alert(error)
    })
  })
  
};
