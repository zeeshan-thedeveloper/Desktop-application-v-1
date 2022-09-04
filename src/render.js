// button listeners

const {
  storeHostId,
  storeHostUserName,
  getStoredHostUserName,
} = require("./DeviceInfoManager/DeviceInfoManager");
const { sendRequestToCentralAPI } = require("./request-manager/requestManager");
const { GET_UNIQUE_ID } = require("./request-manager/requestUrls");
const CENTRAL_API = require("./request-manager/urls");

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

$("#listOfServiceManagers_btn").click(()=>{
  $("#listOfServiceManagers_subScreen").show(200);
  $("#mysqlSettings_subScreen").hide("slow", function () {});
  $("#manageDatabases_subScreen").hide("slow", function () {});
  $("#localServer_subScreen").hide("slow", function () {});
  $("#liveLogs_subScreen").hide("slow", function () {});
});
$("#mysqlSettings_btn").click(()=>{
  $("#listOfServiceManagers_subScreen").hide("slow", function () {});
  $("#mysqlSettings_subScreen").show(200);
  $("#manageDatabases_subScreen").hide("slow", function () {});
  $("#localServer_subScreen").hide("slow", function () {});
  $("#liveLogs_subScreen").hide("slow", function () {});
});
$("#manageDatabases_btn").click(()=>{
  $("#listOfServiceManagers_subScreen").hide("slow", function () {});
  $("#mysqlSettings_subScreen").hide("slow", function () {});
  $("#manageDatabases_subScreen").show(200);
  $("#localServer_subScreen").hide("slow", function () {});
  $("#liveLogs_subScreen").hide("slow", function () {});
});
$("#localServer_btn").click(()=>{
  $("#listOfServiceManagers_subScreen").hide("slow", function () {});
  $("#mysqlSettings_subScreen").hide("slow", function () {});
  $("#manageDatabases_subScreen").hide("slow", function () {});
  $("#localServer_subScreen").show(200);
  $("#liveLogs_subScreen").hide("slow", function () {});
});
$("#liveLogs_btn").click(()=>{
  $("#listOfServiceManagers_subScreen").hide("slow", function () {});
  $("#mysqlSettings_subScreen").hide("slow", function () {});
  $("#manageDatabases_subScreen").hide("slow", function () {});
  $("#localServer_subScreen").hide("slow", function () {});
  $("#liveLogs_subScreen").show(200);
});

