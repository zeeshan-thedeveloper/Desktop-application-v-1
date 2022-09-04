const { sendRequestToCentralAPI } = require('../request-manager/requestManager');
const { getStoredHostId } = require('../DeviceInfoManager/DeviceInfoManager');
var emiter = require('./Emiters');
const events = require('./Events');
const emitter = require('./Emiters');
const Events = require('./Events');

global.device_Id=null;  
global.hostId=null; 

module.exports = {initEvents:()=>{
    emiter.on(events.UPDATE_DEVICE_ID,()=>{
        
        getStoredHostId().then((hostId)=>{
            let date_ob = new Date();
            let date = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let seconds = date_ob.getSeconds();
            let timeAndData = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
            if(hostId){
                sendRequestToCentralAPI("POST", "/host-api/updateDeviceIdInCache",{
                    hostDeviceId: global.device_Id,
                    hostId:hostId, //which we got from server
                    lastSeenDateAndTime:timeAndData 
                  }).then(async (success)=>{  
                      const data = await success.json(); 
                    //   console.log("Repsonse for updating the device is id: ",data);
                    console.log(data); 
                     
                  },(error)=>{           
                    console.log("Could not update the device id");
                  })    
            }else{
                console.log("Error in  updating the device id : ",hostId)
            } 
            },(error)=>{
                sendRequestToCentralAPI("GET",GET_UNIQUE_ID,{}).then((resp)=>resp.json()).then((data)=>{
                    console.log("Fetched a unique id from server and stored it on hard drive")
                    storeHostId(data.payload);
                    emitter.emit(Events.UPDATE_DEVICE_ID)
                })
            })
    });
}}
