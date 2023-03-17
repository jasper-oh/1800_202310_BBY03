const slider = document.getElementById("slider");
const toggleContent = document.getElementById("toggle-content");

slider.addEventListener("input", () => {
  if (slider.value === slider.min || slider.value === slider.max) {
    toggleContent.style.display = "block";
  } else {
    toggleContent.style.display = "none";
  }
});
