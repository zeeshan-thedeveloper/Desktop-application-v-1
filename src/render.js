
// button listeners

const { storeHostId, storeHostUserName, getStoredHostUserName } = require("./DeviceInfoManager/DeviceInfoManager");
const { sendRequestToCentralAPI } = require("./request-manager/requestManager");
const { GET_UNIQUE_ID } = require("./request-manager/requestUrls");
const CENTRAL_API = require("./request-manager/urls")

$( document ).ready(function() {
  // here we will hide the screens and check some important details.
  $("#dashboardScreen").hide(); 
});

$("#continueBtn").click(()=>{
  var userName =  $('#userNameFld').val();
  getStoredHostUserName().then((userName)=>{
    $( "#nameSettingScreen" ).hide( "slow", function() {  // hide with callback function
      // $("#dashboardScreen").show(200);
      console.log("nameSettingScreen is hidden")
      $("#dashboardScreen").show(200); 
  });  
  }).catch((error)=>{
    storeHostUserName(userName);
    $( "#nameSettingScreen" ).hide( "slow", function() {  // hide with callback function
        // $("#dashboardScreen").show(200);
        console.log("nameSettingScreen is hidden")
        $("#dashboardScreen").show(200); 
    });
    
  })
})



