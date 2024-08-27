import { storedNumberSelected, storedOperators, arithmeticOperators } from "./NumberAndOperatorButtons.js";
import { isTextAreaHaveParenthesis, mappingStartingIndex } from "./NumberAndOperatorButtons.js";
import { calculateTotal, storedValueForTotal } from "./SequenceOfTotal.js";

const otherButtons = ['=', 'CE', '⌫', '.', '(', ')'];
const [EQUAL, CLEAR_ENTRY, REMOVE, DOT, OPEN_PAREN, CLOSE_PAREN] = otherButtons;
const closeParenthesisHTML = `<span class="close-parenthesis" id="close-paren">)</span>`;
let indexOfTotalParenthesis = 0;

const isTextAreaZero = () => {
    const textArea = $("#text-area").text();
    const zero = '0';
    const isItZero = textArea === zero ? true : false;
    return isItZero;
};

const produceOpenOrCloseParenthesis = ({parenthesis, index, isNotNewParenAdded}) => {
    while (index !== 0) {
        if (isNotNewParenAdded) {
            const getTextAreaWithoutCloseParen = $("#text-area").text().substring(0, $("#text-area").text().length - indexOfTotalParenthesis);
            $("#text-area").text(getTextAreaWithoutCloseParen);
            document.querySelector("#text-area").innerHTML += `${OPEN_PAREN}${closeParenthesisHTML}`;
        };

        if (parenthesis === OPEN_PAREN) {
            document.querySelector("#text-area").innerHTML += parenthesis;
        } else {
            if ($("#text-area").html().slice(-1) !== '>') {
                document.querySelector("#text-area").innerHTML += closeParenthesisHTML;
            } else {
                document.querySelector("#close-paren").innerText += parenthesis;
            }
        }
        index--;
        isNotNewParenAdded = false;
    };
};

let operatorThenParenIndex = 0;

const resetValue = (lengthOfStoredNumber) => {
    indexOfTotalParenthesis = 0;
    operatorThenParenIndex = 0;
    while (lengthOfStoredNumber !== 0) {
        storedNumberSelected.pop();
        storedOperators.pop();
        storedValueForTotal.pop();
        lengthOfStoredNumber--;
    };
};

const isLastEquationHaveOperator = () => {
    const currentLastEquation = $("#last-total").text();
    const split = [...currentLastEquation];
    for (const element of split) {
        if (arithmeticOperators.includes(element)) return true;
    };
    return false;
};

const checkIfEqualClicked = (clickedButton) => {
    const currentTextArea = $("#text-area").text();
    if (clickedButton === EQUAL) return;
    
    if (isLastEquationHaveOperator()) {
        $("#text-area").css("fontSize", "3rem");
        if (clickedButton === '⌫' || clickedButton === 'Backspace') {
            const currentLastEquation = $("#last-total").text();
            $("#text-area").text(currentLastEquation.slice(0, currentLastEquation.length - 1));
            $("#last-total").text("");
            for (let index = storedValueForTotal.length; index !== 0; index--) {
                storedValueForTotal.pop();
            };
            return;
        }

        $("#last-total").text(`Ans = ${currentTextArea}`);
        resetValue(storedNumberSelected.length);

        if (arithmeticOperators.includes(clickedButton)) {
            storedNumberSelected.push(parseFloat(currentTextArea));
            return;
        }; 

        $("#text-area").text('0');
    };

    return;
};

const otherButton = (buttonClicked) => {
    checkIfEqualClicked(buttonClicked);
    switch (buttonClicked) {
        case DOT:
            const textArea = $("#text-area").text();
            const index = mappingStartingIndex(textArea);
            const valueInput = textArea.slice(index, textArea.length);

            if (isTextAreaZero()) return $("#text-area").text(DOT);

            if (isTextAreaHaveParenthesis({clickedButton: DOT})) return;

            if (!valueInput.includes(DOT)) document.querySelector("#text-area").innerText += DOT;
            break;
        case EQUAL:
            const currentTextArea = $("#text-area").text();
            const isOperator = currentTextArea.slice(0, currentTextArea.length - indexOfTotalParenthesis).slice(-1);

            if (arithmeticOperators.includes($("#text-area").text().slice(-1)) || arithmeticOperators.includes(isOperator) || $("#text-area").text().slice(-1) === '.') {
                $("#text-area").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                break;
            }
            
            if (!isLastEquationHaveOperator() && storedOperators.length !== 0) {
                const totalValue = calculateTotal(storedNumberSelected, storedOperators);
                $("#last-total").text(`${currentTextArea}=`);
                $("#text-area").text(totalValue);
                if ($("#text-area").width() > $("#text-area-container").width()) {
                    $("#text-area").css("fontSize", "2rem");
                };
                return;
            }

            $("#text-area").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
            break;
        case CLEAR_ENTRY:
            $("#text-area").text('0');

            resetValue(storedNumberSelected.length);
            break;
        case REMOVE:
            let indexForRemoving = 1;
            
            if ($("#text-area").text().includes(OPEN_PAREN)) indexForRemoving = indexOfTotalParenthesis + 1;
            
            const removedChar = indexOfTotalParenthesis === 0 ? $("#text-area").text().slice(-1) : $("#text-area").text().slice(-indexForRemoving).slice(0, 1);
            const previousTextArea = $("#text-area").text().substring(0, $("#text-area").text().length - indexForRemoving);
            const isLastCharOpenParen = $("#text-area").text().substring(0, $("#text-area").text().length - indexOfTotalParenthesis).slice(-1) === OPEN_PAREN;
            const isOnlyOneChar = $("#text-area").text().length === 1;
            const displayNewTextArea = isOnlyOneChar ? '0' : previousTextArea;
            
            if (removedChar === OPEN_PAREN && arithmeticOperators.includes(previousTextArea.slice(-1))) operatorThenParenIndex--;
            if (isLastCharOpenParen) indexOfTotalParenthesis--;

            if (previousTextArea === "" && indexOfTotalParenthesis === 0) return $("#text-area").text('0');
            $("#text-area").text(displayNewTextArea);

            if(previousTextArea.includes(OPEN_PAREN)) {
                document.querySelector("#text-area").innerHTML += closeParenthesisHTML;
                if (indexOfTotalParenthesis >= 1) produceOpenOrCloseParenthesis({parenthesis: CLOSE_PAREN, index: indexOfTotalParenthesis - 1});
            };
            
            const indexStart = mappingStartingIndex($("#text-area").text());
            const updateValue = $("#text-area").text().slice(indexStart, previousTextArea.length);
            const isLastCharOperator = arithmeticOperators.includes(removedChar);
            const lastIndex = isLastCharOperator ? storedOperators.length - 1 : storedNumberSelected.length - 1;
            
            if ((isLastCharOperator || (isLastCharOpenParen && storedOperators[storedOperators.length - 1] === OPEN_PAREN)) && previousTextArea.slice(-1) !== OPEN_PAREN) {
                storedOperators.pop();
                return;
            };
            
            if (updateValue === "" && removedChar !== OPEN_PAREN) {
                storedNumberSelected.pop();
                return;
            };

            if (!updateValue.includes(OPEN_PAREN) && updateValue !== "") storedNumberSelected.splice(lastIndex, 1, parseFloat(updateValue));
            break;
        case OPEN_PAREN:
            const openParenthesis = `(`;
            const openAndCloseParenthesis = `${openParenthesis}${closeParenthesisHTML}`;
            const firstChar = $("#text-area").text().charAt(0);

            if (isTextAreaZero()) {
                indexOfTotalParenthesis++;
                return $("#text-area").html(openAndCloseParenthesis);
            };
               
            if ($("#text-area").text().includes(openParenthesis) && firstChar === openParenthesis && storedOperators.length === 0) {
                indexOfTotalParenthesis++;
                $("#text-area").text('');
                produceOpenOrCloseParenthesis({parenthesis: openParenthesis, index: indexOfTotalParenthesis});
                produceOpenOrCloseParenthesis({parenthesis: CLOSE_PAREN, index: indexOfTotalParenthesis});
                return;
            }

            if ($("#text-area").text().includes(openParenthesis)) {
                let notAddedOfNewOpenCloseParen = true;
                const isLastCharOperator = $("#text-area").text().substring(0, $("#text-area").text().length - indexOfTotalParenthesis).slice(-1);
                if (arithmeticOperators.includes(isLastCharOperator)) operatorThenParenIndex++;
                produceOpenOrCloseParenthesis({parenthesis: CLOSE_PAREN, index: indexOfTotalParenthesis, isNotNewParenAdded: notAddedOfNewOpenCloseParen});
                indexOfTotalParenthesis++;
                return;
            };

            if (arithmeticOperators.includes($("#text-area").text().slice(-1))) operatorThenParenIndex++;
            document.querySelector("#text-area").innerHTML += openAndCloseParenthesis;
            indexOfTotalParenthesis++;
            break;
        case CLOSE_PAREN:
            if ($("#close-paren").text().length !== 0) {
                const closeParenToAdd = $("#close-paren").text().length - 1;
                const indexSlice = closeParenToAdd - (closeParenToAdd * 2);
                const withoutCloseParen = $("#text-area").text().slice(0, indexSlice);
                const textArea = $("#text-area").text();
                closeParenToAdd === 0 ? $("#text-area").text(textArea) : $("#text-area").text(withoutCloseParen);
                produceOpenOrCloseParenthesis({ parenthesis: CLOSE_PAREN, index: closeParenToAdd });
            }
            break;
        default:
            break;
    }
}

export { otherButton };
export { indexOfTotalParenthesis, operatorThenParenIndex, closeParenthesisHTML, checkIfEqualClicked };