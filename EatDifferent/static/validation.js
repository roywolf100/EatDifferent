const form =
  document.getElementById("register-form") ||
  document.getElementById("login-form");

const usernameInput = document.getElementById("username");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const repeatPasswordInput = document.getElementById("confirm-password");
const input = document.querySelectorAll(".form-input");

const errorMessages = document.querySelectorAll(".error-message");

const validations = {
  username: {
    required: "Username is required",
    minlength: "Username must be at least 4 characters",
    cantSpaces: "Username cant contain spaces",
    onlyEngNum: "Username must contain only English letters and numbers",
  },
  email: {
    required: "Email is required",
    unValid: "Email is not valid",
    pattern: "Please enter a valid email address",
  },
  password: {
    required: "Password is required",
    minlength: "Password must be between 6-12 characters",
    pattern: "Password must contain only English letters, numbers and symbols",
    upperCase: "Password must contain at least 1 uppercase letter",
    specialCharacter: "Password must contain at least 1 special character",
    num: "Password must contain at least 1 number",
    cantSpaces: "Username cant contain spaces",
  },
  confirmPassword: {
    required: "Confirm password is required",
    dontMatch: "Passwords dont match",
  },
  firstName: {
    required: "First name is required",
    minlength: "First name must be at least 2 characters",
  },
  lastName: {
    required: "Last name is required",
    minlength: "Last name must be at least 2 characters",
  },
};

function Errors() {
  if (usernameInput !== null) {
    if (usernameInput.value === "") {
      document.getElementById("username-m").innerHTML =
        validations.username.required;
      usernameInput.classList.add("input-error");
    } else if (usernameInput.value.length < 4) {
      document.getElementById("username-m").innerHTML =
        validations.username.minlength;
      usernameInput.classList.add("input-error");
    } else if (usernameInput.value.includes(" ")) {
      document.getElementById("username-m").innerHTML =
        validations.username.cantSpaces;
      usernameInput.classList.add("input-error");
    } else {
      document.getElementById("username-m").innerHTML = "";
      usernameInput.classList.remove("input-error");
    }

    if (firstNameInput.value === "") {
      document.getElementById("first-name-m").innerHTML =
        validations.firstName.required;
      firstNameInput.classList.add("input-error");
    } else if (firstNameInput.value.length < 2) {
      document.getElementById("first-name-m").innerHTML =
        validations.firstName.minlength;
      firstNameInput.classList.add("input-error");
    } else {
      document.getElementById("first-name-m").innerHTML = "";
      firstNameInput.classList.remove("input-error");
    }

    if (lastNameInput.value === "") {
      document.getElementById("last-name-m").innerHTML =
        validations.lastName.required;
      lastNameInput.classList.add("input-error");
    } else if (lastNameInput.value.length < 2) {
      document.getElementById("last-name-m").innerHTML =
        validations.lastName.minlength;
      lastNameInput.classList.add("input-error");
    } else {
      document.getElementById("last-name-m").innerHTML = "";
      lastNameInput.classList.remove("input-error");
    }

    if (emailInput.value === "") {
      document.getElementById("email-m").innerHTML = validations.email.required;
      emailInput.classList.add("input-error");
    } else if (
      !emailInput.value.includes("@") ||
      !emailInput.value.includes(".")
    ) {
      document.getElementById("email-m").innerHTML = validations.email.unValid;
      emailInput.classList.add("input-error");
    } else {
      document.getElementById("email-m").innerHTML = "";
      emailInput.classList.remove("input-error");
    }

    if (passwordInput.value === "") {
      document.getElementById("password-m").innerHTML =
        validations.password.required;
      passwordInput.classList.add("input-error");
    } else if (passwordInput.value.length < 6) {
      document.getElementById("password-m").innerHTML =
        validations.password.minlength;
      passwordInput.classList.add("input-error");
    } else if (passwordInput.value.length > 12) {
      document.getElementById("password-m").innerHTML =
        validations.password.minlength;
      passwordInput.classList.add("input-error");
    } else if (!/[A-Z]/.test(passwordInput.value)) {
      document.getElementById("password-m").innerHTML =
        validations.password.upperCase;
      passwordInput.classList.add("input-error");
    } else if (
      !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(passwordInput.value)
    ) {
      document.getElementById("password-m").innerHTML =
        validations.password.specialCharacter;
      passwordInput.classList.add("input-error");
    } else if (!/[1-9]/.test(passwordInput.value)) {
      document.getElementById("password-m").innerHTML =
        validations.password.num;
      passwordInput.classList.add("input-error");
    } else {
      document.getElementById("password-m").innerHTML = "";
      passwordInput.classList.remove("input-error");
    }

    if (repeatPasswordInput.value === "") {
      document.getElementById("confirm-password-m").innerHTML =
        validations.confirmPassword.required;
      repeatPasswordInput.classList.add("input-error");
    } else if (repeatPasswordInput.value !== passwordInput.value) {
      document.getElementById("confirm-password-m").innerHTML =
        validations.confirmPassword.dontMatch;
      repeatPasswordInput.classList.add("input-error");
    } else {
      repeatPasswordInput.classList.remove("input-error");
      document.getElementById("confirm-password-m").innerHTML = "";
    }
  } else {
    if (emailInput.value === "") {
      document.getElementById("email-m").innerHTML = validations.email.required;
      emailInput.classList.add("input-error");
    } else if (
      !emailInput.value.includes("@") ||
      !emailInput.value.includes(".")
    ) {
      document.getElementById("email-m").innerHTML = validations.email.unValid;
      emailInput.classList.add("input-error");
    } else {
      document.getElementById("email-m").innerHTML = "";
      emailInput.classList.remove("input-error");
    }

    if (passwordInput.value === "") {
      document.getElementById("password-m").innerHTML =
        validations.password.required;
      passwordInput.classList.add("input-error");
    } else if (passwordInput.value.length < 6) {
      document.getElementById("password-m").innerHTML =
        validations.password.minlength;
      passwordInput.classList.add("input-error");
    } else if (passwordInput.value.length > 12) {
      document.getElementById("password-m").innerHTML =
        validations.password.minlength;
      passwordInput.classList.add("input-error");
    } else if (!/[A-Z]/.test(passwordInput.value)) {
      document.getElementById("password-m").innerHTML =
        validations.password.upperCase;
      passwordInput.classList.add("input-error");
    } else if (
      !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(passwordInput.value)
    ) {
      document.getElementById("password-m").innerHTML =
        validations.password.specialCharacter;
      passwordInput.classList.add("input-error");
    } else if (!/[1-9]/.test(passwordInput.value)) {
      document.getElementById("password-m").innerHTML =
        validations.password.num;
      passwordInput.classList.add("input-error");
    } else {
      document.getElementById("password-m").innerHTML = "";
      passwordInput.classList.remove("input-error");
    }
  }
}

function ResetForm(e) {
  e.preventDefault();

  const inputs = document.querySelectorAll(".form-input");

  form.reset();

  inputs.forEach((input) => {
    input.classList.remove("input-error");
  });

  const messageIds = [
    "username-m",
    "first-name-m",
    "last-name-m",
    "email-m",
    "password-m",
    "confirm-password-m",
  ];
  messageIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = "";
    }
  });
}

input.forEach((input) => {
  input.addEventListener("input", (e) => {
    if (input.classList.contains("input-error")) {
      Errors();
    }
    if (input.id == "password" || input.id == "confirm-password")
      input.value = input.value.replace(
        /[^A-Za-z0-9!@#$%^&*()_+\-=[\]{};:'",.<>/?\\|]/g,
        ""
      );
    else if (input.id == "username")
      input.value = input.value.replace(/[^A-Za-z0-9]/g, "");
    else if (input.id == "email")
      input.value = input.value.replace(/[^A-Za-z0-9\-_@.]/g, "");
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  Errors();
});

const resetButton = document.querySelector(".reset-button");
if (resetButton) {
  resetButton.addEventListener("click", ResetForm);
}
