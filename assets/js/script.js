const slider = document.querySelector("#slider");
const lengthValue = document.querySelector(".generator__length-value");
const checkboxes = document.querySelectorAll(".generator__checkbox");
const generateBtn = document.querySelector(".generator__generate-btn");
const passwordDisplay = document.querySelector(".generator-result p");
const copyBtn = document.querySelector(".generator__copy-btn");
const copiedText = document.querySelector(".generator__copied-text");
const strengthText = document.querySelector(".generator__strength-text");
const strengthBars = document.querySelectorAll(".generator__strength-bar");

slider.addEventListener("input", handleSliderInput);
generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyToClipboard);

function handleSliderInput() {
  lengthValue.textContent = this.value;
  updateSliderColor(this.value);
}

function updateSliderColor(value) {
  const breakpoint = (value / 20) * 100;
  slider.style.background = `linear-gradient(90deg, #a4ffaf ${breakpoint}%, #18171f ${breakpoint}%)`;
}

function generatePassword(event) {
  event.preventDefault();
  const length = slider.value;
  const options = {
    uppercase: document.querySelector("input[name='uppercase']").checked,
    lowercase: document.querySelector("input[name='lowercase']").checked,
    numbers: document.querySelector("input[name='numbers']").checked,
    symbols: document.querySelector("input[name='symbols']").checked,
  };

  const charset = buildCharset(options);
  if (!charset) {
    passwordDisplay.textContent = "Select options!";
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  passwordDisplay.textContent = password;
  updateStrengthIndicator(password);
}

function buildCharset({ uppercase, lowercase, numbers, symbols }) {
  let charset = "";
  if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) charset += "0123456789";
  if (symbols) charset += "!@#$%^&*()_-+=<>?/";
  return charset;
}

function copyToClipboard() {
  const textarea = document.createElement("textarea");
  textarea.value = passwordDisplay.textContent;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  copiedText.classList.remove("generator__copied-text--hidden");
  setTimeout(
    () => copiedText.classList.add("generator__copied-text--hidden"),
    2000
  );
}

function updateStrengthIndicator(password) {
  let strength = 0;
  if (password.match(/[A-Z]/)) strength++;
  if (password.match(/[a-z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^a-zA-Z0-9]/)) strength++;

  strengthText.textContent =
    ["Too Weak!", "Weak", "Medium", "Strong"][strength - 1] || "Too Weak";
  strengthBars.forEach((bar, index) => {
    bar.dataset.level = index < strength ? strength : "";
  });
}
