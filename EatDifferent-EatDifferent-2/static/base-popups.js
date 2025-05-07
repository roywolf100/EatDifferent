const myhealthPopUp = document.getElementById("myhealth-popup");
const myhealthA = document.getElementById("close-popup-myhealth");
const overlayBase = document.getElementById("black-overlay");

myhealthPopUp.style.display = "none";

function MyHealthPopup() {
  myhealthPopUp.style.display = "block";
  overlayBase.style.display = "block";
}

myhealthA.addEventListener("click", () => {
  myhealthPopUp.style.display = "none";
  overlayBase.style.display = "none";
});

overlayBase.addEventListener("click", () => {
  myhealthPopUp.style.display = "none";
  overlayBase.style.display = "none";
});

function changeData() {
  const goal = document.getElementById("goal-data");
  const activity = document.getElementById("activity-data");
  const height = document.getElementById("height-data");
  const weight = document.getElementById("weight-data");

  console.log(weight.value, height.value, goal.value, activity.value);

  const response = fetch(`/health_data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      goal: goal.value,
      activity: activity.value,
      height: height.value,
      weight: weight.value,
    }),
  });
}
