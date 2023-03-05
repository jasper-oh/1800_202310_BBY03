// Auto update slider label when drag

var slider1 = document.getElementById("slider1");
var sliderLabel1 = document.getElementById("sliderValueLabel1");
slider1.addEventListener("input", function() {
  sliderLabel1.innerHTML = slider1.value;
});

var slider2 = document.getElementById("slider2");
var sliderLabel2 = document.getElementById("sliderValueLabel2");
slider2.addEventListener("input", function() {
  sliderLabel2.innerHTML = slider2.value;
});