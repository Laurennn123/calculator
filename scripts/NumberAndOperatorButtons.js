import { indexOfTotalParenthesis, closeParenthesisHTML } from "./OtherButtons.js";

const storedNumberSelected = [];
const storedOperators = [];
const arithmeticOperators = ['+', '−', '×', '÷'];
let indexForStartingNumber = 0;

const isTextAreaHaveParenthesis = ({clickedButton}) => {
    const openParenthesis = '(';

    if (indexOfTotalParenthesis !== 0) {
        const getTextAreaWithoutCloseParen = $("#text-area").text().substring(0, $("#text-area").text().length - indexOfTotalParenthesis);
        const lastCharacter = getTextAreaWithoutCloseParen.slice(-1);
        let index = indexOfTotalParenthesis;

        $("#text-area").text(getTextAreaWithoutCloseParen);

        if (lastCharacter !== openParenthesis || !arithmeticOperators.includes(clickedButton)) {
            const textArea = $("#text-area").text();
            const dot = '.';
            const isHaveDot = textArea.slice(indexForStartingNumber, textArea.length).includes(dot);

            if (arithmeticOperators.includes(lastCharacter) && arithmeticOperators.includes(clickedButton)) {
                const textAreaWithoutOperator = getTextAreaWithoutCloseParen.slice(0, $("#text-area").text().length - 1);
                $("#text-area").text(`${textAreaWithoutOperator}${clickedButton}`);
                storedOperators.splice(storedOperators.length - 1, 1, clickedButton);
            } else if ((!isHaveDot && clickedButton === dot) || clickedButton !== dot) {
                document.querySelector("#text-area").innerHTML += clickedButton;
            };
            
        };

        if (((lastCharacter === openParenthesis && !arithmeticOperators.includes(clickedButton)) || (arithmeticOperators.includes(clickedButton) && lastCharacter !== openParenthesis)) && !arithmeticOperators.includes(lastCharacter)) {
            const isClickedOperator = arithmeticOperators.includes(clickedButton) ? 1 : 0;
            indexForStartingNumber = getTextAreaWithoutCloseParen.length + isClickedOperator;
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
        console.log(storedNumberSelected, storedOperators)
        return true;
    };
};

let operatorThenParenIndex = 0;

const displayClickedNumber = (numberClicked) => {
    const textArea = $("#text-area").text();
    const itsFirstCharNotDot = $("#text-area").text().charAt(0) !== '.';
    const zero = '0';

    if (textArea === zero && ((itsFirstCharNotDot && numberClicked !== zero) || numberClicked === zero)) {
        $("#text-area").text(numberClicked);
        storedNumberSelected.push(parseInt(numberClicked))
        indexForStartingNumber = 0;
        console.log(storedNumberSelected)
        return;
    };

    isTextAreaHaveParenthesis({clickedButton: numberClicked});

    if (indexOfTotalParenthesis === parseInt(zero)) document.querySelector("#text-area").innerText += numberClicked;

    const updatedTextArea = $("#text-area").text();
    const checkingElementBeforeParen = $("#text-area").text().substring(0, (indexForStartingNumber - 1)).slice(-1)
    const isOpenParen = $("#text-area").text().substring(0, indexForStartingNumber).slice(-1);
    if (arithmeticOperators.includes(checkingElementBeforeParen) && isOpenParen === '(') operatorThenParenIndex++;
    const index = storedOperators.length - operatorThenParenIndex;
    const value = updatedTextArea.slice(indexForStartingNumber, updatedTextArea.length);
    const indexForAdding = storedOperators.length === 0 ? 0 : index;
    storedNumberSelected.splice(indexForAdding, 1, parseFloat(value));
    console.log(storedNumberSelected, storedOperators);
};

const displayClickedArithOperator = (operator) => {
    const lastCharacter = $("#text-area").text().slice(-1);

    if (arithmeticOperators.includes(lastCharacter)) {
        const currentDisplayNumber = $("#text-area").text().slice(0, -1);
        storedOperators.splice(storedOperators.length - 1, 1, operator);
        $("#text-area").text(`${currentDisplayNumber}${operator}`);
        return;
    };

    if (isTextAreaHaveParenthesis({clickedButton: operator})) return;

    document.querySelector("#text-area").innerText += operator;
    storedOperators.push(operator);
    indexForStartingNumber = $("#text-area").text().length;
};

export { storedNumberSelected, storedOperators };
export { displayClickedNumber, displayClickedArithOperator};
export { isTextAreaHaveParenthesis };
export { indexForStartingNumber };