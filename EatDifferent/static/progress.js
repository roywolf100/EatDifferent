document.addEventListener("DOMContentLoaded", function () {
  const formContainers = document.querySelectorAll(".container");
  const nextButtons = document.querySelectorAll(".form-submit");
  const backButtons = document.querySelectorAll(".back-button");
  const formInputs = document.querySelectorAll(".form-input");

  let currentStep = 0;

  const validators = {
    validateGoalStep() {
      const goalInputs = document.querySelectorAll('input[name="goal"]');
      const isSelected = Array.from(goalInputs).some((input) => input.checked);
      const errorElement = document.getElementById("radio-error-goal");

      if (isSelected) {
        errorElement.innerHTML = "";
      } else {
        errorElement.innerHTML = "Please select one of the options";
      }
      return isSelected;
    },

    validateActivityStep() {
      const activityInputs = document.querySelectorAll(
        'input[name="activity"]'
      );
      const isSelected = Array.from(activityInputs).some(
        (input) => input.checked
      );
      const errorElement = document.getElementById("radio-error-activity");

      if (isSelected) {
        errorElement.innerHTML = "";
      } else {
        errorElement.innerHTML = "Please select one of the options";
      }
      return isSelected;
    },

    validateDate() {
      const dateInput = document.getElementById("date");
      const dateError = document.getElementById("date-error");
      const selectedDate = new Date(dateInput.value);
      const today = new Date();
      const maxAge = 100;

      dateError.innerHTML = "";

      if (!dateInput.value) {
        dateError.innerHTML = "Please select your birth date";
        return false;
      }

      if (selectedDate > today) {
        dateError.innerHTML = "Birth date cannot be in the future";
        return false;
      }

      const age = Math.floor(
        (today - selectedDate) / (365.25 * 24 * 60 * 60 * 1000)
      );

      if (age > maxAge) {
        dateError.innerHTML = `Age cannot be more then ${maxAge} years`;
        return false;
      }

      return true;
    },

    validateStatsStep() {
      const heightInput = document.getElementById("height");
      const weightInput = document.getElementById("weight");
      const genderInputs = document.querySelectorAll('input[name="gender"]');
      const isGenderSelected = Array.from(genderInputs).some(
        (input) => input.checked
      );

      let isValid = true;

      const heightError = document.getElementById("height-error");
      if (!heightInput.value.trim()) {
        heightError.innerHTML = "Please enter your height";
        isValid = false;
      } else if (heightInput.value < 50 || heightInput.value > 300) {
        heightError.innerHTML = "Please enter a valid height (50-300 cm)";
        isValid = false;
      } else {
        heightError.innerHTML = "";
      }

      const weightError = document.getElementById("weight-error");
      if (!weightInput.value.trim()) {
        weightError.innerHTML = "Please enter your weight";
        isValid = false;
      } else if (weightInput.value < 20 || weightInput.value > 500) {
        weightError.innerHTML = "Please enter a valid weight (20-500 kg)";
        isValid = false;
      } else {
        weightError.innerHTML = "";
      }

      const genderError = document.getElementById("gender-error");
      if (!isGenderSelected) {
        genderError.innerHTML = "Please select your gender";
        isValid = false;
      } else {
        genderError.innerHTML = "";
      }

      isValid = this.validateDate() && isValid;

      return isValid;
    },
  };

  const allRadioInputs = document.querySelectorAll('input[type="radio"]');
  allRadioInputs.forEach((radio) => {
    radio.addEventListener("change", () => {
      switch (radio.name) {
        case "goal":
          document.getElementById("radio-error-goal").innerHTML = "";
          break;
        case "activity":
          document.getElementById("radio-error-activity").innerHTML = "";
          break;
        case "gender":
          document.getElementById("gender-error").innerHTML = "";
          break;
      }
    });
  });

  const statsInputs = Array.from(document.querySelectorAll(".stats-input"));

  statsInputs.forEach((input) => {
    input.addEventListener("input", () => {
      validators.validateStatsStep();
    });
  });

  const dateInput = document.getElementById("date");
  if (dateInput) {
    dateInput.addEventListener("change", () => {
      validators.validateDate();
    });
  }

  function goToNextStep(event) {
    if (event) {
      event.preventDefault();
    }

    let isValid = true;

    if (currentStep === 0) {
      isValid = validators.validateGoalStep();
    } else if (currentStep === 1) {
      isValid = validators.validateActivityStep();
    } else if (currentStep === 2) {
      isValid = validators.validateStatsStep();
    }

    if (isValid && currentStep < formContainers.length - 1) {
      formContainers[currentStep].classList.add("none-active-form");
      currentStep++;
      formContainers[currentStep].classList.remove("none-active-form");
    }
  }

  function goToBackStep(event) {
    if (event) {
      event.preventDefault();
    }

    if (currentStep > 0) {
      formContainers[currentStep].classList.add("none-active-form");
      currentStep--;
      formContainers[currentStep].classList.remove("none-active-form");
    }
  }

  nextButtons.forEach((button, index) => {
    if (index < 3) {
      button.addEventListener("click", goToNextStep);
    }
  });

  backButtons.forEach((button) => {
    button.addEventListener("click", goToBackStep);
  });
});
