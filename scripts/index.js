import { displayClickedNumber, displayClickedArithOperator } from "./NumberAndOperatorButtons.js";
import { otherButton } from "./OtherButtons.js";

const ANIMATOR_ELEMENTS = {
    '.': "#buttonDot",
    '+': "#buttonPlus",
    '(': "#buttonOpenParenthesis",
    '=': "#buttonTotal",
    ')': "#buttonCloseParenthesis",
};

const mappingOperators = {
    '*': '×',
    '/': '÷',
    '-': '−',
};

const mapElements = {
    'Enter': '=',
    'Backspace': '⌫',
}

const calculatorButtons = (clickedButton) => {
    const arithmeticOperators = ['+', '−', '×', '÷'];
    const otherButtons = ['=', 'CE', '⌫', '.', '(', ')'];
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    clickedButton = mappingOperators[clickedButton] || mapElements[clickedButton] || clickedButton;    
    if (arithmeticOperators.includes(clickedButton)) {
        displayClickedArithOperator(clickedButton);
    } else if (otherButtons.includes(clickedButton)) {
        otherButton(clickedButton);
    } 
    if (numbers.includes(clickedButton)) displayClickedNumber(clickedButton);
};

for (let button = 0; button < $(".calculatorButtons").length; button++) {
    document.querySelectorAll(".calculatorButtons")[button].addEventListener("click", function() {
        const clickedButton = this.textContent;
        const idValue = ANIMATOR_ELEMENTS[clickedButton] || `#button${clickedButton}`;
        calculatorButtons(clickedButton);
        $(idValue).fadeOut(100).fadeIn(100);
    });
};

document.addEventListener("keydown", function(event){
    calculatorButtons(event.key);
});