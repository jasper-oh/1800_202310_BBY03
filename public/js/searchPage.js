ready(() => {
  function ajaxGet(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        callback(this.responseText)
      } else {
        console.log(this.status)
      }
    }
    xhr.open("GET", url)
    xhr.send();
  }

  const scoreList = () => {
    ajaxGet("/getScoreList", (data) => {

      document.getElementById("searchpage-comment-list").innerHTML = data;
    })
  }
  scoreList();

})


// callback function declaration
function ready(callback) {
  if (document.readyState != "loading") {
    callback();
    console.log("ready state is 'complete'");
  } else {
    document.addEventListener("DOMContentLoaded", callback);
    console.log("Listener was invoked");
  }
}

// Retrieve the location name from the localStorage
const locationName = localStorage.getItem('location');

//display the location into webpage
const scoreListLocationElement = document.getElementById('scoreList-location');
scoreListLocationElement.textContent = locationName;