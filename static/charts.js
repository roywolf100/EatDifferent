const date = new Date();
const currentDay = date.getDay();
const currentMonth = date.getMonth() + 1;
const currentDate = date.getDate();

const dateInWeek = new Date();
dateInWeek.setDate(currentDate + 7);
console.log(dateInWeek);
const dateH2 = document.querySelectorAll(".date");

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
for (let i = 0; i < 7 - currentDay; i++) {
  labels.push(days[currentDay + i]);
}
for (let i = 0; i < currentDay; i++) {
  labels.push(days[i]);
}

Chart.register(ChartDataLabels);

// Data for Doughnut Chart (Target)
const dataTarget = {
  labels: ["Calories Consumed", "Remaining"],
  datasets: [
    {
      label: "Energy diary",
      data: [300, 50], // Adjust this based on your calorie intake
      backgroundColor: ["#8bca34", "#d3d3d3"],
      hoverOffset: 4,
    },
  ],
};

// Custom plugin to add styled text in the center
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
      `${dataTarget.datasets[0].data[0]} kcal`,
      centerX,
      centerY - lineSpacing
    );

    // Line 2
    ctx.font = "bold 18px Arial";
    ctx.fillText("Calories Eaten", centerX, centerY);

    // Line 3
    ctx.font = "italic 14px Arial";
    ctx.fillText(
      `${dataTarget.datasets[0].data[1]} kcal left`,
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

// Data Energy
const dataEnergy = {
  labels,
  datasets: [
    {
      label: "Proteins",
      data: [300, 50, 45, 120, 100, 80, 60],
      backgroundColor: "#6A0DAD",
      borderWidth: 4,
      tension: 0.1,
    },
    {
      label: "Carbs",
      data: [54, 31, 44, 10, 20, 30, 50],
      backgroundColor: "#1E90FF",
      borderWidth: 4,
      tension: 0.1,
    },
    {
      label: "Fats",
      data: [232, 43, 123, 321, 150, 200, 170],
      backgroundColor: "#FFD700",
      borderWidth: 4,
      tension: 0.1,
    },
    {
      label: "Alcohol",
      data: [300, 200, 100, 0, 50, 75, 25],
      backgroundColor: "#D72638",
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
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  },
};

new Chart(document.getElementById("energy-chart"), configEnergy);

// Data Weight
const dataWeight = {
  labels: labels,
  datasets: [
    {
      label: "Weight",
      data: [300, 50, 45, 120, 100, 80, 70],
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

function popUpChange() {
  document.getElementById("meals-content").style.display = "none";
  document.getElementById("search-content").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("meals-content").style.display = "block";
  document.getElementById("search-content").style.display = "none";
});
