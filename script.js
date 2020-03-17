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

function getAllIndexes(arr, val) {
	    var indexes = [], i;
	    for(i = 0; i < arr.length; i++)
	        if (arr[i] === val)
	            indexes.push(i);
	    return indexes;
	}

function collapse_brackets(my_array) {

	close_bracket_indexes = getAllIndexes(my_array, ")");

	let j = close_bracket_indexes[0];
	while (my_array[j] != "(") {
		j--
	}
	// j becomes the position of the corresponding open bracket.

	let start_section = my_array.slice(0, j);
	// console.log(start_section)
	let end_section = my_array.slice(close_bracket_indexes[0]+1);
	// console.log(end_section)
	// console.log(my_array.slice(j+1,close_bracket_indexes[i]));
	// console.log("eval: "+ evaluate(my_array.slice(j+1,close_bracket_indexes[i])))
	//console.log(my_array.slice(j+1,close_bracket_indexes[i]));
	my_array = evaluate(start_section.concat(evaluate(my_array.slice(j+1,close_bracket_indexes[0]))).concat(end_section)); // +1 and -1 are important- the outer brackets are simply sliced out in this way
	// before the section is passed to evaluate. If there are brackets nested within brackets, evaluate() will detect them and recusively pass
	// the array back to collapse_brackets() until no more brackets are detected, breaking the recursion.
	
	return my_array;
}

test_array = [1, "+", 2, "+", "(", 1, "-", 2, "+", "(", 2, "/", 2, "*", "(", 1, "-", 2, ")", "+", "(", 1, "-", 2, ")", ")", "/", 2, ")"];
test = 2/2*-1-1

function evaluate(my_array) {
	if (my_array.indexOf(")") != -1) {
		console.log("here");
		console.log(my_array);
		my_array = collapse_brackets(my_array);
	}
	// Assumes no brackets left in my_array.

	let mult_div = [];
	let add_sub = [];
	for (let i = 0; i< my_array.length; i++) {
		if (["/", "*"].includes(my_array[i])) {
			mult_div.push(i);
		} else if (["+", "-"].includes(my_array[i])) {
			add_sub.push(i);
		}
	}
	let all_operators = mult_div.concat(add_sub);
	console.log("All: "+ all_operators);
	for (let i = 0; i < all_operators.length; i++) {
		let position = all_operators[i];
		let start_section = my_array.slice(0,position-1);
		console.log("Start section: " + start_section);
		let end_section = my_array.slice(position+2);
		console.log("End section: " + end_section);
		console.log(operate(my_array[position-1], my_array[position+1], my_array[position]));
		my_array = start_section.concat(operate(my_array[position-1], my_array[position+1], my_array[position])).concat(end_section)
	}

	while(my_array.some(r=> ["/", "*"].includes(r))) {
		for (let i = 0; i < my_array.length; i++) {
			if (["/", "*"].includes(my_array[i])) {
				let start_section = my_array.slice(0,i-1);
				let end_section = my_array.slice(i+2);
				my_array = start_section.concat(operate(my_array[i-1], my_array[i+1], my_array[i])).concat(end_section);
				break;
			}
		}
	}

	return my_array;
}



/* 
To Do:
	
	- Add clear and delete button
	- Add style changes on click/hover/mousedown for buttons
	- Make "evaluate" logic by using indexof operators in sum_array then passing these and numbers either side of index to operate(),
	then slicing the array with the returned value. 
	- Add calculator-y styles e.g. change the font style.

*/