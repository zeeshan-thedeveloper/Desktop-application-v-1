const Electrolytic = require('electrolytic')
const emiter = require('../src/event-engine/Emiters');
const events = require('../src/event-engine/Events');
const {initEvents} = require('../src/event-engine/Listeners');
initEvents();
// button listeners


$("#continueBtn").click(()=>{
  var userName =  $('#userNameFld').val();
  alert(userName)
})


const electrolytic = Electrolytic({appKey: 'OmGci2murwT1NKqd791x'})

electrolytic.on('token', (token) => {
  console.log('got a token', token);
  global.device_Id=token;
  emiter.emit(events.UPDATE_DEVICE_ID)
})


