//אוכל לדוגמא
const foods = [
  "Pizza",
  "Sushi",
  "Tacos",
  "Spaghetti",
  "Cheeseburger",
  "Fried Chicken",
  "Avocado Toast",
  "Caesar Salad",
  "French Fries",
  "Nachos",
  "Grilled Cheese",
  "Ramen",
  "Pancakes",
  "Waffles",
  "Omelette",
  "Chicken Nuggets",
  "Lasagna",
  "Burrito",
  "Hot Dog",
  "Steak",
  "Lobster",
  "Shrimp Scampi",
  "Mashed Potatoes",
  "Apple Pie",
  "Chocolate Cake",
  "Ice Cream",
  "Doughnuts",
  "Croissant",
  "Mac and Cheese",
  "BBQ Ribs",
  "Clam Chowder",
  "Fried Rice",
  "Spring Rolls",
  "Falafel",
  "Hummus",
  "Guacamole",
  "Tofu Stir-Fry",
  "Pita Bread",
  "Greek Yogurt",
  "Baked Salmon",
  "Stuffed Peppers",
  "Sweet Potato Fries",
  "Chicken Alfredo",
  "Blueberry Muffins",
  "Peanut Butter & Jelly Sandwich",
  "Cornbread",
  "Baked Ziti",
  "Kimchi",
  "Gnocchi",
  "Ratatouille",
];

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
  const content = result.map((list) => {
    return `<li id="${list}" class="food">${list}</li>`;
  });

  resultBox.innerHTML = "<ul>" + content.join("") + "</ul>";
}

function search(word) {
  return (
    word.slice(0, inputValue.length).toLowerCase() === inputValue.toLowerCase()
  );
}

let selectedFood;
function onClick(food) {
  selectedFood = food.id;
  console.log("Selected Food:", selectedFood);
}
