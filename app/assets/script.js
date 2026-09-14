const display = document.getElementById("display");
const history = document.getElementById("history");
const buttons = document.querySelectorAll(".btn");

let expression = "";
let justCalculated = false;

function updateDisplay() {
  display.textContent = expression || "0";
}

function addValue(value) {
  if (justCalculated) {
    expression = "";
    history.textContent = "";
    justCalculated = false;
  }

  const operators = "+-*/";

  if (operators.includes(value)) {
    if (!expression) return;

    const last = expression.slice(-1);

    if (operators.includes(last)) {
      expression = expression.slice(0, -1) + value;
    } else {
      expression += value;
    }
  } else if (value === ".") {
    const parts = expression.split(/[+\-*/]/);
    const currentNumber = parts[parts.length - 1];

    if (!currentNumber.includes(".")) {
      expression += currentNumber ? "." : "0.";
    }
  } else {
    expression += value;
  }

  updateDisplay();
}

function clearCalculator() {
  expression = "";
  history.textContent = "";
  justCalculated = false;
  updateDisplay();
}

function deleteLast() {
  if (justCalculated) {
    clearCalculator();
    return;
  }

  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  if (!expression) return;

  try {
    let calculation = expression;

    // Percentage support
    calculation = calculation.replace(
      /(\d+(?:\.\d+)?)%/g,
      "($1/100)"
    );

    // Security: only calculator characters allowed
    if (!/^[0-9+\-*/().\s]+$/.test(calculation)) {
      throw new Error("Invalid input");
    }

    const result = Function(
      '"use strict"; return (' + calculation + ")"
    )();

    if (!Number.isFinite(result)) {
      throw new Error("Math error");
    }

    history.textContent = expression + " =";

    expression = Number.isInteger(result)
      ? String(result)
      : String(parseFloat(result.toFixed(10)));

    justCalculated = true;
    updateDisplay();

  } catch (error) {
    display.textContent = "Error";
    expression = "";
    justCalculated = true;
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {

    const value = button.dataset.value;
    const action = button.dataset.action;

    if (action === "clear") {
      clearCalculator();
    }

    else if (action === "delete") {
      deleteLast();
    }

    else if (action === "calculate") {
      calculate();
    }

    else if (value !== undefined) {
      addValue(value);
    }
  });
});

// Keyboard support
document.addEventListener("keydown", (event) => {

  const key = event.key;

  if (
    (key >= "0" && key <= "9") ||
    ["+", "-", "*", "/", ".", "%"].includes(key)
  ) {
    addValue(key);
  }

  else if (key === "Enter" || key === "=") {
    calculate();
  }

  else if (key === "Backspace") {
    deleteLast();
  }

  else if (key === "Escape") {
    clearCalculator();
  }
});

updateDisplay();
