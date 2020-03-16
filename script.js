const display = document.getElementById("display_section");


// Creating Numbers
// ---------------------------------------------------------------------------------------------
const number_buttons = document.getElementById("number_button_section");

let numbers = [];
for (let i = 1; i < 10; i++) {
	numbers.push(i);
};
numbers.push(0); // push zero to end of array.

// create buttons
for (let i = 0; i < numbers.length; i++) {
	let button = document.createElement("div");
	button.classList.add("number_button","button");
	button.textContent = numbers[i];
	if (numbers[i] === 0) {
		button.classList.add("zero_button");
	}
	number_buttons.appendChild(button);
}


const operator_buttons = document.getElementById("operator_button_section");

let operators = ["/", "*", "+", "-"];

// create buttons
for (let i = 0; i < operators.length; i++) {
	let button = document.createElement("div");
	button.classList.add("operator_button","button");
	button.textContent = operators[i];
	operator_buttons.appendChild(button);
}


// Create evaluate button
let evaluate_button = document.createElement("div");
evaluate_button.classList.add("evaluate_button","operator_button","button");
evaluate_button.textContent = "=";
const button_sections = document.getElementById("button_sections");
button_sections.appendChild(evaluate_button);


// Doing operations 
//---------------------------------------------------------------------------------

const all_buttons = document.getElementsByClassName("button") 

for (let i = 0; i < all_buttons.length; i++) {
	all_buttons[i].addEventListener("click", (e) => {
		
		// Add content to sum array for the evaluate function
		if (e.target.textContent.includes(operators.concat(["="]))) {
			sum_array.push(e.target.textContent);
		} else {
			sum_array.push(Number(e.target.textContent));
		}

		// Add content to display
		display_array.push(e.target.textContent);
		let display_text = "";
		display_array.forEach((symbol) => {
			display_text = display_text + " " + symbol;
		})
		display.textContent = display_text;
	})
}

let display_array = [];


let sum_array = [];

function operate(num1, num2, op) {
	if (op === "+") {
		return num1 + num2;
	} else if (op === "-") {
		return num1 - num2;
	} else if (op === "/") {
		return num1/num2;
	} else if (op === "*") {
		return num1 * num2;
	} else {
		return 0;
	}
}


function evaluate() {
	for (let i = 0; i < operators.length; i++) {
		
	}
}

/* 
To Do:



*/