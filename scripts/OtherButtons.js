import { indexForStartingNumber } from "./NumberAndOperatorButtons.js";
import { storedNumberSelected, storedOperators } from "./NumberAndOperatorButtons.js";
import { isTextAreaHaveParenthesis } from "./NumberAndOperatorButtons.js";
import { calculateTotal } from "./SequenceOfTotal.js";

const otherButtons = ['=', 'CE', '⌫', '.', '(', ')'];
const [EQUAL, CLEAR_ENTRY, REMOVE, DOT, OPEN_PAREN, CLOSE_PAREN] = otherButtons;
const closeParenthesisHTML = `<span class="close-parenthesis">)</span>`;
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
            document.querySelector("#text-area").innerHTML += `(${closeParenthesisHTML}`;
        };
        document.querySelector("#text-area").innerHTML += parenthesis;
        index--;
        isNotNewParenAdded = false;
    };
};

const otherButton = (buttonClicked) => {
    switch (buttonClicked) {
        case DOT:
            const textArea = $("#text-area").text();
            const valueInput = textArea.slice(indexForStartingNumber, textArea.length);
            
            if (isTextAreaZero()) return $("#text-area").text(DOT);

            if (isTextAreaHaveParenthesis({clickedButton: DOT})) return;

            if (!valueInput.includes(DOT)) document.querySelector("#text-area").innerText += DOT;
            break;
        case EQUAL:
            const totalValue = calculateTotal(storedNumberSelected, storedOperators);
            $("#text-area").text(totalValue);
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
                produceOpenOrCloseParenthesis({parenthesis: closeParenthesisHTML, index: indexOfTotalParenthesis});
                return;
            }

            if ($("#text-area").text().includes(openParenthesis)) {
                let notAddedOfNewOpenCloseParen = true;
                produceOpenOrCloseParenthesis({parenthesis: closeParenthesisHTML, index: indexOfTotalParenthesis, isNotNewParenAdded: notAddedOfNewOpenCloseParen});
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