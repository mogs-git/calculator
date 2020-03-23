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

// create decimal button
let dec_button = document.createElement("div");
dec_button.classList.add("decimal_button", "operator_button", "button");
dec_button.textContent = "."
calc_body.appendChild(dec_button);

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
let prev_ans = "";
console.log(prev_ans);



function resolve_inputs(my_target) {
	let operator_inputs = operators.concat(spec_operators).concat(["=", ".", "Ans"])
	let all_inputs = numbers.map(String).concat(operator_inputs);  

	if (isIn([my_target], all_inputs)) {
		if (isIn([my_target], operator_inputs)) {
			if (my_target === "del") {
				sum_array.pop();
			} else if (my_target === "clr") {
				sum_array = [];
			} else if (my_target === "Ans") {
				if (prev_ans != "") {
					prev_ans.map((el) => {
						sum_array.push(el);
					});
				}
			} else if (my_target != "=") {
				// ERROR CHECKING: check last entry not also operator
				if (operators.includes(sum_array[sum_array.length-1]) && my_target != "(") {
					display_eval.textContent = "ERROR: BAD OPERATOR SEQUENCE";
				} else if (sum_array.length === 0) {
					display_eval.textContent = "ERROR: BAD OPERATOR SEQUENCE";
				} else {
					sum_array.push(my_target);
				}
			} else {
				if (test_div_by_zero(sum_array) === 1) {
					display_eval.textContent = "ERROR: DIVIDE BY ZERO";
				} else if (check_brackets(sum_array) === 1) {
					display_eval.textContent = "ERROR: BAD BRACKET SEQUENCE";
				} else {
					result = evaluate(sum_array)[0];
					prev_ans = String(result).split("");
					sum_array = [];
					display_eval.textContent = result;
				}
			}
		} else {
			sum_array.push(my_target);
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

		display_sum.textContent = display_text;
	}
}

for (let i = 0; i < all_buttons.length; i++) {
	all_buttons[i].addEventListener("mousedown", (e) => {

	e.target.style.color = "red";
	e.target.style.border = "2px solid red";
		
	my_target = e.target.textContent;
		// Add content to sum array for the evaluate function

	resolve_inputs(my_target);
	})

	all_buttons[i].addEventListener("mouseover", (e) => {
		e.target.style.color = "white";
		e.target.style.border = "2px solid white";
	})

	all_buttons[i].addEventListener("mouseout", (e) => {
		e.target.style.color = "black";
		e.target.style.border = "2px solid black";
	})

	all_buttons[i].addEventListener("mouseup", (e) => {
		e.target.style.color = "black";
		e.target.style.border = "2px solid black";
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
	if (!Array.isArray(arr)) {
		console.log("INPUT PASSED TO ISIN() IS NOT AN ARRAY!")
	}
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

		function my_helper(element) {
			if (element.length>1) {
				return element.split("");
			} else {
				return element;
			}
		}
		my_array = my_array.map(String).map(my_helper).flat();
		for (let i = 0; i < my_array.length; i++) {
			if (isIn([my_array[i]], numbers.map(String).concat("."))) {
				num_buffer = num_buffer + my_array[i];
				if (i === my_array.length-1) {
					output_array.push(Number(num_buffer));
				}
			} else if (i === (my_array.length-1)) {
				if (num_buffer != "") {
					output_array.push(Number(num_buffer));
				};
				output_array.push(my_array[i]);
			} else {
				console.log(num_buffer);
				if (num_buffer != "") {
					output_array.push(Number(num_buffer));
				}
				num_buffer = "";
				output_array.push(my_array[i]);
			}
			//console.log(output_array);
		}
		return output_array;
	}
	console.log("Before: " + my_array);
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

function test_div_by_zero(array) {
	for (let i = 0; i < array.length; i++) {
		if (array[i] == "/" && array[i+1] == "0") {
			if (array[i+2] == "." && isIn([array[i+3]], numbers.map(String))) {
				return 0;
			} else {
				return 1;
			} 
		}
	}

	return 0;
}

function check_brackets(array) {
	num_open = array.filter((val) => {
		return val === "(";
	}).length;

	num_closed = array.filter((val) => {
		return val === ")";
	}).length;

	if (num_open != num_closed) {
		return 1;
	}

	open_indexes = getAllIndexes(array, "(");
	closed_indexes = getAllIndexes(array, ")");

	open_indexes.sort(function(a, b) {
	  return a - b;
	});

	closed_indexes.sort(function(a, b) {
	  return a - b;
	});

	while (closed_indexes.length > 0) {
		if (closed_indexes[closed_indexes.length-1] < open_indexes[open_indexes.length-1]) {
			return 1;
		} else {
			closed_indexes.pop();
			open_indexes.pop();
		}
	}

	return 0;
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
	} else if (my_target === "a") {
		my_target = "Ans";
	}

	resolve_inputs(my_target);
}






/* 
To Do:

- Implement error checking!
	- Dividing by zero
	- incorrect sequencing of operators and operands
	- Add a check to collapse brackets, filter for brackets, make sure they collapse in bracket-only sequence i.e. ["(",")","(","(",")",")"]
*/
