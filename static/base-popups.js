const allergiesPopup = document.getElementById("allergies-popup");
const allergiesA = document.getElementById("allergies-a");
const overlayBase = document.getElementById("black-overlay");

function AllergiesPopup() {
  allergiesPopup.style.display = "block";
  overlayBase.style.display = "block";
}

allergiesA.addEventListener("click", () => {
  allergiesPopup.style.display = "none";
  overlayBase.style.display = "none";
});

overlayBase.addEventListener("click", () => {
  allergiesPopup.style.display = "none";
  overlayBase.style.display = "none";
});
