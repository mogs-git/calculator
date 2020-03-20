const display = document.getElementById("display_section");
const display_sum = document.createElement("div");
const display_eval = document.createElement("div");
display_sum.classList.add("display_child");
display_eval.classList.add("display_child");
display.appendChild(display_sum);
display.appendChild(display_eval);

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

// Creating operators
//-------------------------------------------------------------------------------
const operator_buttons = document.getElementById("operator_button_section");

let operators = ["/", "*", "+", "-"];

// create buttons
for (let i = 0; i < operators.length; i++) {
	let button = document.createElement("div");
	button.classList.add("operator_button","button");
	button.textContent = operators[i];
	operator_buttons.appendChild(button);
}

const spec_operator_buttons = document.getElementById("spec_operator_button_section");

let spec_operators = ["(", ")", "del", "clr"];

// create buttons
for (let i = 0; i < spec_operators.length; i++) {
	let button = document.createElement("div");
	button.classList.add("operator_button","button");
	button.textContent = spec_operators[i];
	spec_operator_buttons.appendChild(button);
}


// create ANS button
let ans_button = document.createElement("div");
ans_button.classList.add("ans_button", "operator_button", "button");
ans_button.textContent = "Ans"
const calc_body = document.getElementById("calculator_body"); // Move somewhere else?
calc_body.appendChild(ans_button);


// Create evaluate button
let evaluate_button = document.createElement("div");
evaluate_button.classList.add("evaluate_button","operator_button","button");
evaluate_button.textContent = "=";
calc_body.appendChild(evaluate_button);



// Doing operations 
//---------------------------------------------------------------------------------

const all_buttons = document.getElementsByClassName("button") 
let result;
let my_target;
let current_num = "";
let sum_array = [];
let display_array = [];



function resolve_inputs(my_target) {
	let operator_inputs = operators.concat(spec_operators).concat(["="])
	let all_inputs = numbers.map(String).concat(operator_inputs);  

	if (isIn([my_target], all_inputs)) {
		if (isIn([my_target], operator_inputs)) {
			if (my_target === "del") {
				sum_array.pop();
			} else if (my_target === "clr") {
				sum_array = [];
			} else if (my_target != "=") {
				sum_array.push(my_target);
			} else {
				result = evaluate(sum_array)[0];
				sum_array = [];
				display_eval.textContent = result;
			}
		} else {
			sum_array.push(my_target)
		}

		display_text = "";
		for (let i = 0; i < sum_array.length; i++) {
			if (i === 0) {
				display_text += sum_array[i];
			} else if (isIn([sum_array[i]], operator_inputs)) {
				display_text += " " + sum_array[i] + " ";
				current_num = "";
			} else {
				display_text = display_text + sum_array[i];
			}
		}

		// sum_array.forEach((symbol, index) => {
		// 	if (index === 0) {
		// 		display_text = symbol;
		// 	} else {
		// 		display_text = display_text + " " + symbol;
		// 	}
		// })
		display_sum.textContent = display_text;
	}
}

for (let i = 0; i < all_buttons.length; i++) {
	all_buttons[i].addEventListener("click", (e) => {
		
	my_target = e.target.textContent;
		// Add content to sum array for the evaluate function

	resolve_inputs(my_target);
	// 	if (isIn([my_target], operators.concat(spec_operators).concat(["="]))) {
	// 		if (my_target === "del") {
	// 			sum_array.pop();
	// 		} else if (my_target === "clr") {
	// 			sum_array = [];
	// 		} else if (my_target != "=") {
	// 			sum_array.push(my_target);
	// 		} else {
	// 			result = evaluate(sum_array)[0];
	// 			sum_array = [result];
	// 			display_sum.textContent = result;
	// 			display_eval.textContent = result;
	// 		}
	// 	} else {
	// 		sum_array.push(Number(my_target));
	// 	}

	// 	let display_text = "";
	// 	// Add content to display
	// 	if (my_target === "del") {
	// 		display_array.pop();
	// 	} else if (my_target === "clr") {
	// 		display_array = [];
	// 	} else if (my_target === "=") {
	// 		display_array = [result];
	// 	} else {
	// 		display_array.push(my_target);
	// 	}
	// 	display_array.forEach((symbol) => {
	// 		display_text = display_text + " " + symbol;
	// 	})
	// 	display_sum.textContent = display_text;
	// })
	})
}

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

function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

function isIn (arr, haystack) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};

function collapse_brackets(my_array) {

	close_bracket_indexes = getAllIndexes(my_array, ")");

	let j = close_bracket_indexes[0];
	while (my_array[j] != "(") {
		j--
	}
	// j becomes the position of the corresponding open bracket.

	let before_bracket = my_array.slice(0, j);
	let after_bracket = my_array.slice(close_bracket_indexes[0]+1);

	my_array = evaluate(before_bracket.concat(evaluate(my_array.slice(j+1,close_bracket_indexes[0]))).concat(after_bracket)); // +1 and -1 are important- the outer brackets are simply sliced out in this way
	// before the section is passed to evaluate. If there are brackets nested within brackets, evaluate() will detect them and recusively pass
	// the array back to collapse_brackets() until no more brackets are detected, breaking the recursion.
	
	return my_array;
}

test_array = [1, "+", 2, "+", "(", 1, "-", 2, "+", "(", 2, "/", 2, "*", "(", 1, "-", 2, ")", "+", "(", 1, "-", 2, ")", ")", "/", 2, ")"];
test = 2/2*-1-1

function evaluate(my_array) {

	function conv_string_to_num(my_array) {
		let output_array = [];
		let num_buffer = "";
		for (let i = 0; i < my_array.length; i++) {
			if (i === (my_array.length-1)) {
				num_buffer = num_buffer + my_array[i];
				output_array.push(Number(num_buffer));
				num_buffer = "";
			} else if (isIn([my_array[i]], numbers.map(String))) {
				num_buffer = num_buffer + my_array[i];
			} else {
				output_array.push(Number(num_buffer));
				num_buffer = "";
				output_array.push(my_array[i]);
			}
		}
		return output_array;
	}
	console.log(my_array)
	my_array = conv_string_to_num(my_array);
	console.log(my_array);
	if (my_array.indexOf(")") != -1) {
		my_array = collapse_brackets(my_array);
	}

	// Assumes no brackets left in my_array.
	while (isIn(["/", "*"], my_array)) {
		indexes = [my_array.indexOf("/"),my_array.indexOf("*")];
		indexes = indexes.filter((e) => {
			return e > 0;
		})
		i = Math.min(...indexes) // get leftmost
		let start_section = my_array.slice(0,i-1);
		let end_section = my_array.slice(i+2);
		my_array = start_section.concat(operate(my_array[i-1], my_array[i+1], my_array[i])).concat(end_section);
	}
	while(isIn(["+", "-"], my_array)) {
		indexes = [my_array.indexOf("+"),my_array.indexOf("-")];
		indexes = indexes.filter((e) => {
			return e > 0;
		})
		i = Math.min(...indexes) // get leftmost
		let start_section = my_array.slice(0,i-1);
		let end_section = my_array.slice(i+2);
		my_array = start_section.concat(operate(my_array[i-1], my_array[i+1], my_array[i])).concat(end_section);
	}

	return my_array;
}

// Keyboard presses
//-------------------------------------------------------------------------------------
document.addEventListener('keydown', register_key);

function register_key(e) {
	my_target = e.key;

	if (my_target === "Backspace") {
		my_target = "del";
	} else if (my_target === "c") {
		my_target = "clr";
	}

	resolve_inputs(my_target);

}





/* 
To Do:
	
	- Add clear and delete button
	- Add style changes on click/hover/mousedown for buttons
	- Make "evaluate" logic by using indexof operators in sum_array then passing these and numbers either side of index to operate(),
	then slicing the array with the returned value. 
	- Add calculator-y styles e.g. change the font style.

*/