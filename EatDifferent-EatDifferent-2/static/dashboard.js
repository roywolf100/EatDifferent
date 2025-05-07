const date = new Date();
const currentDay = date.getDay();
const currentMonth = date.getMonth() + 1;
const currentDate = date.getDate();

const dateInWeek = new Date();
dateInWeek.setDate(date.getDate() + 7);

const dateH2 = document.querySelectorAll(".date");

let caloriesPerDay = 0;
let caloriesAte = 0;

dateH2.forEach((d) => {
  d.innerHTML = `(${currentDate}.${currentMonth} - ${dateInWeek.getDate()}.${
    dateInWeek.getMonth() + 1
  })`;
});

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let labels = [];
for (let i = currentDay + 1; i < days.length; i++) {
  labels.push(days[i]);
}

for (let i = 0; i <= currentDay; i++) {
  labels.push(days[i]);
}

let breakfastCal;
let lunchCal;
let dinnerCal;
let snacksCal;

fetch(`/get_mealcal`, {
  method: "POST",
})
  .then((response) => response.json())
  .then((calories) => {
    breakfastCal = parseInt(calories[0]);
    lunchCal = parseInt(calories[1]);
    dinnerCal = parseInt(calories[2]);
    snacksCal = parseInt(calories[3]);

    fetch(`/get_calories`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((calories) => {
        caloriesPerDay = calories[0];
        caloriesAte = calories[1];

        let breakfastCalGoal = caloriesPerDay * 0.25;
        let lunchCalGoal = caloriesPerDay * 0.35;
        let dinnerCalGoal = caloriesPerDay * 0.25;
        let snacksCalGoal = caloriesPerDay * 0.15;

        document.getElementById(
          "breakfast-cal"
        ).innerHTML = `${breakfastCal}/${Math.round(breakfastCalGoal)}`;
        document.getElementById(
          "lunch-cal"
        ).innerHTML = `${lunchCal}/${Math.round(lunchCalGoal)}`;
        document.getElementById(
          "dinner-cal"
        ).innerHTML = `${dinnerCal}/${Math.round(dinnerCalGoal)}`;
        document.getElementById(
          "snacks-cal"
        ).innerHTML = `${snacksCal}/${Math.round(snacksCalGoal)}`;

        document.getElementById("breakfast-progress").style.width =
          (breakfastCal / breakfastCalGoal) * 100 + "%";

        document.getElementById("lunch-progress").style.width =
          (lunchCal / lunchCalGoal) * 100 + "%";

        document.getElementById("dinner-progress").style.width =
          (dinnerCal / dinnerCalGoal) * 100 + "%";

        document.getElementById("snacks-progress").style.width =
          (snacksCal / snacksCalGoal) * 100 + "%";

        drawChart();
        nutritionGoals();
      });
  });

Chart.register(ChartDataLabels);

// Data for Doughnut Chart (Target)
function drawChart() {
  const dataTarget = {
    labels: ["Remaining", "Calories Consumed"],
    datasets: [
      {
        label: "Energy diary",

        data: [caloriesPerDay - caloriesAte, caloriesAte],
        backgroundColor: ["#d3d3d3", "#8bca34"],
        hoverOffset: 4,
      },
    ],
  };

  const centerTextPlugin = {
    id: "centerText",
    afterDraw(chart) {
      const {
        ctx,
        chartArea: { width, height },
      } = chart;

      ctx.save();
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const centerX = width / 2;
      const centerY = height / 2;
      const lineSpacing = 22;

      // Line 1
      ctx.font = "bold 24px Arial";
      ctx.fillText(
        dataTarget.datasets[0].data[1],
        centerX,
        centerY - lineSpacing
      );

      // Line 2
      ctx.font = "bold 18px Arial";
      ctx.fillText("Calories Eaten", centerX, centerY);

      // Line 3
      ctx.font = "italic 14px Arial";
      ctx.fillText(
        `Daily Goal: ${caloriesPerDay} kcal`,
        centerX,
        centerY + lineSpacing
      );

      ctx.restore();
    },
  };

  const configTarget = {
    type: "doughnut",
    data: dataTarget,
    options: {
      cutout: "72%",
      maintainAspectRatio: false,
      responsive: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
    plugins: [centerTextPlugin],
  };

  new Chart(document.getElementById("chart"), configTarget);
}

let proteinPerDay;
let carbsPerDay;
let fatsPerDay;
// Data Energy
function nutritionGoals() {
  fetch(`/get_goal`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((goal) => {
      switch (goal[0]) {
        case "cut":
          proteinPerDay = Math.round((caloriesPerDay * 0.4) / 4);
          carbsPerDay = Math.round((caloriesPerDay * 0.3) / 4);
          fatsPerDay = Math.round((caloriesPerDay * 0.3) / 7);
          break;
        case "maintain":
          proteinPerDay = Math.round((caloriesPerDay * 0.3) / 4);
          carbsPerDay = Math.round((caloriesPerDay * 0.4) / 4);
          fatsPerDay = Math.round((caloriesPerDay * 0.3) / 7);
          break;
        case "bulk":
          proteinPerDay = Math.round((caloriesPerDay * 0.25) / 4);
          carbsPerDay = Math.round((caloriesPerDay * 0.55) / 4);
          fatsPerDay = Math.round((caloriesPerDay * 0.2) / 7);
          break;
      }

      document.getElementById("p-goal").innerHTML = proteinPerDay + "g";
      document.getElementById("c-goal").innerHTML = carbsPerDay + "g";
      document.getElementById("f-goal").innerHTML = fatsPerDay + "g";
    });
}

let weeklyProtein = [];
let weeklyCarbs = [];
let weeklyFats = [];

fetch(`/get_weekly_nutrition`, {
  method: "POST",
})
  .then((response) => response.json())
  .then((data) => {
    for (let i = currentDay + 1; i < days.length; i++) {
      weeklyProtein.push(parseInt(data[i][1]));
      weeklyCarbs.push(parseInt(data[i][2]));
      weeklyFats.push(parseInt(data[i][3]));
    }

    for (let i = 0; i <= currentDay; i++) {
      weeklyProtein.push(parseInt(data[i][1]));
      weeklyCarbs.push(parseInt(data[i][2]));
      weeklyFats.push(parseInt(data[i][3]));
    }

    console.log("data: " + typeof data[6][1]);

    const dataEnergy = {
      labels,
      datasets: [
        {
          label: "Proteins",
          data: weeklyProtein,
          backgroundColor: "#3B82F6",
          borderWidth: 4,
          tension: 0.1,
        },
        {
          label: "Carbs",
          data: weeklyCarbs,
          backgroundColor: "#F59E0B",
          borderWidth: 4,
          tension: 0.1,
        },
        {
          label: "Fats",
          data: weeklyFats,
          backgroundColor: "#10B981",
          borderWidth: 4,
          tension: 0.1,
        },
      ],
    };

    const configEnergy = {
      type: "line",
      data: dataEnergy,
      options: {
        maintainAspectRatio: false,
        responsive: false,
        scales: {
          y: {
            min: 0,
          },
        },
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    };

    new Chart(document.getElementById("energy-chart"), configEnergy);
  });
// Data Weight
let weeklyWeight = [];
fetch(`/get_weight`, {
  method: "POST",
})
  .then((response) => response.json())
  .then((weight) => {
    for (let i = currentDay + 1; i < days.length; i++) {
      weeklyWeight.push(parseFloat(weight[i]));
    }

    for (let i = 0; i <= currentDay; i++) {
      weeklyWeight.push(parseFloat(weight[i]));
    }

    console.log(weeklyWeight);

    const dataWeight = {
      labels: labels,
      datasets: [
        {
          label: "Weight",
          data: weeklyWeight,
          backgroundColor: "#A2D5F2",
          borderWidth: 4,
          tension: 0.1,
        },
      ],
    };

    const configWeight = {
      type: "line",
      data: dataWeight,
      options: {
        maintainAspectRatio: false,
        responsive: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    };
    new Chart(document.getElementById("weight-chart"), configWeight);
  });

const searchBtn = document.getElementById("search-btn");
const closeBtn = document.getElementById("close-popup-search");
const overlay = document.getElementById("black_overlay");
const searchPopup = document.getElementById("search-popup");

//food search popup
searchBtn.addEventListener("click", () => {
  searchPopup.style.display = "block";
  overlay.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  searchPopup.style.display = "none";
  overlay.style.display = "none";
});

overlay.addEventListener("click", () => {
  searchPopup.style.display = "none";
  overlay.style.display = "none";
});

let mealType;
function popUpChange() {
  let isChecked = false;
  document.getElementsByName("meals").forEach((meal) => {
    if (meal.checked) {
      isChecked = true;
      mealType = meal.id;
      console.log(mealType);
    }
  });

  if (isChecked) {
    document.getElementById("meals-content").style.display = "none";
    document.getElementById("search-content").style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("meals-content").style.display = "block";
  document.getElementById("search-content").style.display = "none";
});

let foods = [];

fetch(`/get_food`, {
  method: "POST",
})
  .then((response) => response.json())
  .then((food) => {
    foods = food;
  });

const input = document.getElementById("search-food");
const resultBox = document.getElementById("result");
let inputValue;
let foodList;

input.onkeyup = function () {
  let result = [];
  inputValue = input.value;

  if (inputValue.length) {
    result = foods.filter((word) => search(word));
  }

  display(result);
  foodList = document.querySelectorAll(".food");

  foodList.forEach((food) => {
    food.addEventListener("click", () => onClick(food));
  });
};

function display(result) {
  const limitedResults = result.slice(0, 4);

  const content = limitedResults.map((list) => {
    return `<li id="${list}" class="food">${list}</li>`;
  });

  resultBox.innerHTML = `<ul id="list-con"> ${content.join("")} </ul>`;
}

function search(word) {
  if (word) {
    return word.toLowerCase().includes(inputValue.toLowerCase());
  }
}

function popUpChangeFood() {
  document.getElementById("search-content").style.display = "none";
  document.getElementById("food-nutrition-content").style.display = "block";
  document.getElementById("food-name").innerHTML = selectedFood;
}

let servingCalories;
let servingProtein;
let servingCarbs;
let servingFats;

let selectedFood;
let serving = document.getElementById("amount-food");
function onClick(food) {
  selectedFood = food.id;
  console.log("Selected Food:", selectedFood);
  popUpChangeFood();

  fetch(`/get_nutrition`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      foodname: selectedFood,
    }),
  })
    .then((response) => response.json())
    .then((nutrition) => {
      serving.addEventListener("input", () => {
        servingCalories = Math.round((nutrition[0] / 100) * serving.value);
        document.getElementById("calories-show").innerHTML = servingCalories;

        servingProtein = Math.round((nutrition[1] / 100) * serving.value);
        document.getElementById("protiens-show").innerHTML =
          servingProtein + "g";

        servingCarbs = Math.round((nutrition[2] / 100) * serving.value);
        document.getElementById("carbs-show").innerHTML = servingCarbs + "g";

        servingFats = Math.round((nutrition[3] / 100) * serving.value);
        document.getElementById("fats-show").innerHTML = servingFats + "g";
      });
    });
}

function fetchDailyFood() {
  if (document.getElementById("amount-food")) {
    fetch(`/daily_intake`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        calories: servingCalories,
        protein: servingProtein,
        carbs: servingCarbs,
        fats: servingFats,
        meal: mealType,
      }),
    })
      .then((response) => response.json())
      .then((nutrition) => {
        caloriesAte = nutrition[0][0];
        console.log(nutrition);
        location.reload();
      });
  }
}
