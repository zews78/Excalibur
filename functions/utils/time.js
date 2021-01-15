const getSessions=(openingTime,closingTime)=>{
  let sessions=["Morning","Afternoon","Evening"];
  const open=parseInt(openingTime.slice(0,2))
  const close=parseInt(closingTime.slice(0,2))
  if(open>=12){
    sessions = sessions.filter(item => item !== "Morning")
  }
  if(open>=14){
    sessions = sessions.filter(item => item !== "Afternoon")
  }
 if(close<=12){
   sessions = sessions.filter(item => item !== "Afternoon")
   sessions = sessions.filter(item => item !== "Evening")
  }
  if(close<=14){
    sessions = sessions.filter(item => item !== "Evening")
  }
  return sessions;
}

var myDate = "2020-11-28";

let toTimestamp = strDate => Date.parse(strDate)
console.log(toTimestamp("2020-11-28")/1000)

module.exports={
  getSessions,
}
