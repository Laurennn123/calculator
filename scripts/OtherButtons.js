import { storedNumberSelected, storedOperators, arithmeticOperators } from "./NumberAndOperatorButtons.js";
import { isTextAreaHaveParenthesis } from "./NumberAndOperatorButtons.js";
import { calculateTotal } from "./SequenceOfTotal.js";
import { storedValueForTotal } from "./SequenceOfTotal.js";
import { mappingStartingIndex } from "./NumberAndOperatorButtons.js";

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
            document.querySelector("#close-paren").innerText += parenthesis;
        }
        index--;
        isNotNewParenAdded = false;
    };
};

let isEqualNotClicked = true;

const otherButton = (buttonClicked) => {
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
            const totalValue = calculateTotal(storedNumberSelected, storedOperators);

            if (arithmeticOperators.includes($("#text-area").text().slice(-1))) return;

            if (isEqualNotClicked) $("#text-area").text(totalValue), isEqualNotClicked = false;
            console.log(storedValueForTotal);
            break;
        case CLEAR_ENTRY:
            const clearTextArea = '0';
            let length = storedNumberSelected.length;

            $("#text-area").text(clearTextArea);

            indexOfTotalParenthesis = 0;
            isEqualNotClicked = true;
            while (length !== 0) {
                storedNumberSelected.pop();
                storedOperators.pop();
                storedValueForTotal.pop();
                length--;
            };
            console.log(storedValueForTotal);
            break;
        case REMOVE:
            let indexForRemoving = 1;

            if ($("#text-area").text().includes(OPEN_PAREN)) indexForRemoving = indexOfTotalParenthesis + 1;
            
            const removedChar = indexOfTotalParenthesis === 0 ? $("#text-area").text().slice(-1) : $("#text-area").text().slice(-indexForRemoving).slice(0, 1);
            const previousTextArea = $("#text-area").text().substring(0, $("#text-area").text().length - indexForRemoving);
            const isLastCharOpenParen = $("#text-area").text().substring(0, $("#text-area").text().length - indexOfTotalParenthesis).slice(-1) === OPEN_PAREN;
            const isOnlyOneChar = $("#text-area").text().length === 1;
            const displayNewTextArea = isOnlyOneChar ? '0' : previousTextArea;
           
            $("#text-area").text(displayNewTextArea);

            if (isLastCharOpenParen) indexOfTotalParenthesis--;
            if(previousTextArea.includes(OPEN_PAREN)) {
                document.querySelector("#text-area").innerHTML += closeParenthesisHTML;
                if (indexOfTotalParenthesis !== 1 && !isLastCharOpenParen) produceOpenOrCloseParenthesis({parenthesis: CLOSE_PAREN, index: indexOfTotalParenthesis - 1});
            }
            
            const indexStart = mappingStartingIndex($("#text-area").text());
            const updateValue = $("#text-area").text().slice(indexStart, previousTextArea.length);
            const isLastCharOperator = arithmeticOperators.includes(removedChar);
            const lastIndex = isLastCharOperator ? storedOperators.length - 1 : storedNumberSelected.length - 1;
            if (isLastCharOperator || isLastCharOpenParen) {
                storedOperators.pop();
                if (isNaN(storedNumberSelected[storedNumberSelected.length -1])) storedNumberSelected.pop();
                console.log(storedNumberSelected, storedOperators);
                return;
            }

            storedNumberSelected.splice(lastIndex, 1, parseFloat(updateValue));
            console.log(storedNumberSelected, storedOperators);
            break;
        case OPEN_PAREN:
            const openParenthesis = `(`;
            const openAndCloseParenthesis = `${openParenthesis}${closeParenthesisHTML}`;
            const firstChar = $("#text-area").text().charAt(0);

            if (isTextAreaZero()) return $("#text-area").html(openAndCloseParenthesis);

            if ($("#text-area").text().includes(openParenthesis) && firstChar === openParenthesis) {
                indexOfTotalParenthesis++;
                $("#text-area").text('');
                produceOpenOrCloseParenthesis({parenthesis: openParenthesis, index: indexOfTotalParenthesis});
                document.querySelector("#text-area").innerHTML += openAndCloseParenthesis;
                produceOpenOrCloseParenthesis({parenthesis: CLOSE_PAREN, index: indexOfTotalParenthesis});
                return;
            }

            if ($("#text-area").text().includes(openParenthesis)) {
                let notAddedOfNewOpenCloseParen = true;
                produceOpenOrCloseParenthesis({parenthesis: CLOSE_PAREN, index: indexOfTotalParenthesis, isNotNewParenAdded: notAddedOfNewOpenCloseParen});
                indexOfTotalParenthesis++;
                return;
            };

            document.querySelector("#text-area").innerHTML += openAndCloseParenthesis;
            indexOfTotalParenthesis++;
            break;
        default:
            break;
    }
}

export { otherButton };
export { indexOfTotalParenthesis, closeParenthesisHTML };