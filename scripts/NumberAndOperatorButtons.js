import { indexOfTotalParenthesis, operatorThenParenIndex, closeParenthesisHTML, checkIfEqualClicked } from "./OtherButtons.js";

const storedNumberSelected = [];
const storedOperators = [];
const arithmeticOperators = ['+', '−', '×', '÷'];

const mappingStartingIndex = (updatedTextArea) => {
    const split = [...updatedTextArea];
    if(split[0] === '(' && storedOperators.length === 0) return indexOfTotalParenthesis;
    const indexForSlice = split.reduce((accumulator, operator, index) => {
        const lastOperator = storedOperators[storedOperators.length - 1];
        if (operator === lastOperator) accumulator.push(index);
        return accumulator;
    }, []);
    return indexForSlice[indexForSlice.length - 1] + 1;
};

const isTextAreaHaveParenthesis = ({clickedButton}) => {
    const openParenthesis = '(';
    if (indexOfTotalParenthesis !== 0) {
        const getTextAreaWithoutCloseParen = $("#text-area").text().substring(0, $("#text-area").text().length - indexOfTotalParenthesis);
        const lastCharacter = getTextAreaWithoutCloseParen.slice(-1);
        let index = indexOfTotalParenthesis;

        $("#text-area").text(getTextAreaWithoutCloseParen);

        if (lastCharacter !== openParenthesis || !arithmeticOperators.includes(clickedButton)) {
            const textArea = $("#text-area").text();
            const index = mappingStartingIndex(textArea);
            const dot = '.';
            const isHaveDot = textArea.slice(index, textArea.length).includes(dot);

            if (arithmeticOperators.includes(lastCharacter) && arithmeticOperators.includes(clickedButton)) {
                const textAreaWithoutOperator = getTextAreaWithoutCloseParen.slice(0, $("#text-area").text().length - 1);
                $("#text-area").text(`${textAreaWithoutOperator}${clickedButton}`);
                storedOperators.splice(storedOperators.length - 1, 1, clickedButton);
            } else if ((!isHaveDot && clickedButton === dot) || clickedButton !== dot) {
                document.querySelector("#text-area").innerHTML += clickedButton;
            };
            
        };

        if (((lastCharacter === openParenthesis && !arithmeticOperators.includes(clickedButton) && !isNaN(storedNumberSelected[storedNumberSelected.length - 1])) || (arithmeticOperators.includes(clickedButton) && lastCharacter !== openParenthesis)) && !arithmeticOperators.includes(lastCharacter)) {
            const isItOperator = arithmeticOperators.includes(clickedButton) ? clickedButton : openParenthesis;
            storedOperators.push(isItOperator);
        };

        while (index != 0) {
            if (index === indexOfTotalParenthesis) {
                document.querySelector("#text-area").innerHTML += closeParenthesisHTML;
            } else {
                document.querySelector("#close-paren").innerText += ')';
            }
            index--;
        };
        return true;
    };
};

const displayClickedNumber = (number) => {
    const itsFirstCharNotDot = $("#text-area").text().charAt(0) !== '.';
    const zero = '0';

    checkIfEqualClicked(number);

    if ($("#text-area").text() === zero && ((itsFirstCharNotDot && number !== zero) || number === zero)) {
        $("#text-area").text(number);
        storedNumberSelected.push(parseFloat(number))
        return;
    };

    isTextAreaHaveParenthesis({clickedButton: number});

    if (indexOfTotalParenthesis === parseInt(zero)) document.querySelector("#text-area").innerHTML += number;

    const updatedTextArea = $("#text-area").text();
    const indexForStarting = mappingStartingIndex(updatedTextArea);
    const index = storedOperators.length - operatorThenParenIndex;
    const indexForAdding = storedOperators.length === 0 ? 0 : index;
    const startingIndex = arithmeticOperators.includes(...arithmeticOperators) || indexOfTotalParenthesis !== 0 ? indexForStarting : 0;
    const value = updatedTextArea.slice(startingIndex, updatedTextArea.length - indexOfTotalParenthesis);
    storedNumberSelected.splice(indexForAdding, 1, parseFloat(value));
};

const displayClickedArithOperator = (operator) => {
    const lastCharacter = $("#text-area").text().slice(-1);

    checkIfEqualClicked(operator);

    if (arithmeticOperators.includes(lastCharacter)) {
        const currentDisplayNumber = $("#text-area").text().slice(0, -1);
        storedOperators.splice(storedOperators.length - 1, 1, operator);
        $("#text-area").text(`${currentDisplayNumber}${operator}`);
        return;
    };

    if (isTextAreaHaveParenthesis({clickedButton: operator})) return;

    document.querySelector("#text-area").innerText += operator;
    storedOperators.push(operator);
};

export { storedNumberSelected, storedOperators, arithmeticOperators };
export { displayClickedNumber, displayClickedArithOperator};
export { isTextAreaHaveParenthesis, mappingStartingIndex };