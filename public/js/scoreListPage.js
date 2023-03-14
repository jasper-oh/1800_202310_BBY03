let params = new URL( window.location.href ); //get URL of search bar
let lat = params.searchParams.get("lat");
let long = params.searchParams.get("long")
let searchLoc = params.searchParams.get("city")

document.getElementById("scoreList-location").innerHTML = searchLoc;

var coords = new firebase.firestore.GeoPoint(lat, long)

var mincoords = new firebase.firestore.GeoPoint(parseInt(lat)-1 , parseInt(long)-1)
var maxcoords = new firebase.firestore.GeoPoint(parseInt(lat)+1 , parseInt(long)+1)

console.log(mincoords)
console.log(maxcoords)


let realDataSet = []

function getRatings(){
  db.collection("ratings").where("coords", ">" , mincoords).where("coords", "<", maxcoords).get()
  .then( ratings => {
    ratings.forEach(doc => {    
      console.log(doc)  
      realDataSet.push(
        {
          "userImg" : "/images/logoWhite.png",
          "userID" : doc.data().userID,
          "userEmail" : doc.data().email,
          "curHumidity" : doc.data().curHumidity,
          "curTemp" : doc.data().curTemp
        }
      )
    })
    console.log(realDataSet)
    for(let j = 0 ; j < Object.keys(realDataSet[0]).length ; j++){
      generateData(realDataSet[j].userImg , realDataSet[j].curTemp , realDataSet[j].curHumidity , realDataSet[j].userScore )
    }
  })
}

getRatings();

function generateData(imgSrc ,temp, humid ,score){
  const tbody = document.getElementById("tbody");
  const insertRow = tbody.insertRow();
  const imgData = insertRow.insertCell();
  const tempData = insertRow.insertCell()
  const humidData = insertRow.insertCell();
  const scoreData = insertRow.insertCell();

  let imgTag = document.createElement("IMG")
  imgTag.setAttribute("src" , imgSrc);
  imgTag.setAttribute("width" , "40px");
  imgData.appendChild(imgTag);
  let tempDataText = document.createTextNode(temp);
  tempData.appendChild(tempDataText)
  let humidDataText = document.createTextNode(humid);
  humidData.appendChild(humidDataText)
  let scoreDataText = document.createTextNode(score);
  scoreData.appendChild(scoreDataText)
}

  // for(let j = 0 ; j < Object.keys(dataSet[0]).length ; j++){
  //   generateData(dataSet[j].img , dataSet[j].userTemp , dataSet[j].userHumid , dataSet[j].userScore )
  // }


