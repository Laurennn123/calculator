let index = 0;
let storedNumberSelected = [];
let storedOperators = [];
let newLengthOfTextArea;
let lastLengthOfTextArea;
let lastIndex;
let lastTextArea = "";
let clickButton = true;
let dot = true;
let equalButtonClick_And_NoOperatorIncludes = false;
let backwardIndexCloseparenthesis = 0;
let indexOfParenthesis = 0;
let gettingValueStartAtOpenParenthesis;
const FIRST_INDEX = 0;
const closeParenthesis = ')';

for (let i = 0; i < $(".calculatorButtons").length; i++) {
    document.querySelectorAll(".calculatorButtons")[i].addEventListener("click", function() {
        let clickedButton = this.textContent;
        calculatorButtons(clickedButton);
        try {
            $("#button" + clickedButton).fadeOut(100).fadeIn(100);
        } catch {
            switch (clickedButton) {
                case '(':
                    $("#buttonOpenParenthesis").fadeOut(100).fadeIn(100);
                    break;
                case '=':
                    $("#buttonTotal").fadeOut(100).fadeIn(100);
                    break;
                case ')':
                    $("#buttonCloseParenthesis").fadeOut(100).fadeIn(100);
                    break;    
                default:
                    break;    
            }
        }
    });
};

document.addEventListener("keydown", function(event){
    calculatorOperator(event.key);
});

function calculatorButtons(clickedButton) {
    let operators = ['+', '−', '×', '÷', '=', 'CE', '⌫', '.', '(', ')'];

    if (operators.includes(clickedButton)) {
        calculatorOperator(clickedButton);
    } else if ($("#text-area").text() != 0) {
        displayClickedToTextArea(clickedButton);
        let textArea = $("#text-area").text();
        
        if (newLengthOfTextArea > lastLengthOfTextArea) {
            if (equalButtonClick_And_NoOperatorIncludes) {
                reset();
                equalButtonClick_And_NoOperatorIncludes = false;
                if (textArea.at(FIRST_INDEX) === '.') {
                    $("#text-area").text('.');
                    displayClickedToTextArea(clickedButton);
                } else {
                    $("#text-area").text(clickedButton);
                }
                let newTextArea = $("#text-area").text();
                let newClickedNumber = newTextArea.slice(FIRST_INDEX, $("#text-area").text().length);
                storedNumberSelected[index] = parseInt(newClickedNumber);
            } else {
                let getNextNumberAfterOperator
                if(textArea.slice(-1) !== closeParenthesis) {
                    getNextNumberAfterOperator = textArea.slice(lastLengthOfTextArea + 1, $("#text-area").text().length);
                } else {
                    getNextNumberAfterOperator = textArea.slice(lastLengthOfTextArea, $("#text-area").text().length);
                }
                storedNumberSelected[index] = parseFloat(getNextNumberAfterOperator);
            }
        } else {
            let getNumberValueBeforeOperatorOrParenthesis;
            let lastLengthOfTextAreaWithParenthesis = lastLengthOfTextArea;
            if (textArea.includes(closeParenthesis)) {
                const STARTING_INDEX = indexOfParenthesis === 1
                ? lastLengthOfTextAreaWithParenthesis 
                : gettingValueStartAtOpenParenthesis;
                getNumberValueBeforeOperatorOrParenthesis = textArea.slice(STARTING_INDEX, backwardIndexCloseparenthesis);
            } else {
                getNumberValueBeforeOperatorOrParenthesis = textArea.slice(FIRST_INDEX, $("#text-area").text().length);
            }
            storedNumberSelected[index] = parseFloat(getNumberValueBeforeOperatorOrParenthesis);
        }
        clickButton = true;

    } else {
        let textArea = $("#text-area").text();
        if (textArea.charAt(FIRST_INDEX) === '.' && textArea.at(1) === '0') {
            displayClickedToTextArea(clickedButton);
        } else {
            firstNumberDisplay(clickedButton);
            $("#text-area").text(clickedButton);
        }
    }
};

function firstNumberDisplay(numberPicked) {
    numberPicked = parseInt(numberPicked);
    storedNumberSelected[index] = numberPicked;
}

function produceGreyCloseParenthesis(indexOfOpenAndClose) {
    let totalOfCloseParenthesis = '';
    while (indexOfOpenAndClose > 0) {
        totalOfCloseParenthesis += closeParenthesis.fontcolor("gray");
        indexOfOpenAndClose--;
    }
    return totalOfCloseParenthesis;
}

const NUMBER_OPERATORS = ['0', '1', '2', '3', '4', '5', '6' ,'7' ,'8' ,'9'];
const ARITHMETIC_OPERATORS = ['+', '−', '÷', '×'];

let haveParenthesis = false;
let nextIndex = true;

let parenthesisSequence = [];

function calculatorOperator(operator) {
    if (NUMBER_OPERATORS.includes(operator)) {
        calculatorButtons(operator);
    } else if (ARITHMETIC_OPERATORS.includes(operator)) {
        operatorOperation(operator);
    } else {
        switch (operator) {
            case '(':
                if ($("#text-area").text() === '0') {
                    $("#text-area").html('(' + closeParenthesis.fontcolor("gray"));
                    haveParenthesis = true;
                } else {
                    let openAndCloseParenthesis = '(' + closeParenthesis.fontcolor("gray");
                    let previousCloseParenthesis = produceGreyCloseParenthesis(indexOfParenthesis);
                    let textArea = $("#text-area").text();
                    if (haveParenthesis) {
                        $("#text-area").html(textArea.slice(FIRST_INDEX, backwardIndexCloseparenthesis) + openAndCloseParenthesis + previousCloseParenthesis);
                    } else {
                        const ZERO = 0;
                        if (indexOfParenthesis === ZERO) {
                            $("#text-area").html(textArea.slice(FIRST_INDEX) + ('(' + closeParenthesis.fontcolor("gray")));
                            haveParenthesis = true;
                        }
                    }
                }  
                indexOfParenthesis++;
                backwardIndexCloseparenthesis--;
                if (indexOfParenthesis === 1) {
                    // getting length without close parenthesis is the purpose of minus 1
                    if (indexOfParenthesis !== index) {
                        lastLengthOfTextArea = $("#text-area").text().length - 1; 
                    } else {
                        lastLengthOfTextArea = $("#text-area").text().length - indexOfParenthesis; 
                    }
                } else {
                    let newTextArea = $("#text-area").text(); 
                    gettingValueStartAtOpenParenthesis = newTextArea.slice(lastLengthOfTextArea).length - indexOfParenthesis;
                    gettingValueStartAtOpenParenthesis = gettingValueStartAtOpenParenthesis + lastLengthOfTextArea;
                    lastLengthOfTextArea = gettingValueStartAtOpenParenthesis;
                }
                nextIndex = true;
                clickButton = false;
                break;
            case ')':
                break;        
            case '.':
                if (dot) {
                    let textArea = $("#text-area").text();
                    if ($("#text-area").text() === "0" || equalButtonClick_And_NoOperatorIncludes) {
                        storedNumberSelected[index] = 0;
                        $("#text-area").text('.');
                    } else if (ARITHMETIC_OPERATORS.includes(textArea.slice(-1))) {
                        $("#text-area").text(textArea.slice(0, textArea.length) + operator);
                        storedNumberSelected[index] = 0;
                    } else if (!textArea.slice(0, textArea.length).includes('.') || !textArea.slice(lastLengthOfTextArea + 1, textArea.length).includes('.')) {
                        $("#text-area").text(textArea.slice(0, textArea.length) + operator);
                    }
                    clickButton = true;
                    dot = false;
                }
                break;
            case '-':
                operatorOperation('−');
                break;
            case '*':
                operatorOperation('×');
                break;
            case '/':
                operatorOperation('÷');
                break;
            case 'Backspace':
                remove();
                break;
            case '⌫':
                remove();
                break;
            case 'CE':
                reset();
                break;
            case 'Enter':
                totalValue();
                break;    
            case '=':
                totalValue();
                break;
            default:
                break;
        }
    }
}

let lastStoredNumberSelected = [];
let lastStoredOperator = [];

function lastEquation() {
    $("#text-area").text(lastTextArea);
    storedNumberSelected.pop();
    for(let valueOfLastData = 0; valueOfLastData <= lastIndex; valueOfLastData++){
        storedNumberSelected.push(lastStoredNumberSelected[valueOfLastData]);
        storedOperators.push(lastStoredOperator[valueOfLastData]);
    }
    $("#last-total").text("");
    storedOperators.pop();
    index = lastIndex;
    lastStoredOperator = [];
    lastStoredNumberSelected = [];
    equalButtonClick_And_NoOperatorIncludes = false;
    remove();
}

function remove() {
    let textArea = $("#text-area").text();
    let lengthOfTextArea = textArea.length;

    if (lengthOfTextArea >= 2) {
        document.querySelector("#text-area").innerHTML = textArea.slice(0, lengthOfTextArea-1);
        
        if (equalButtonClick_And_NoOperatorIncludes) {
            lastEquation();
        } else if (ARITHMETIC_OPERATORS.includes(textArea.slice(-1))) {
            storedOperators.pop();
            clickButton = true;
            index--;
            if (storedOperators.length === 0) {
                newLengthOfTextArea = undefined;
                lastLengthOfTextArea = undefined;
            } else {
                let lastNumberIndex = storedNumberSelected[index];
                lastLengthOfTextArea -= lastNumberIndex.toString().length+1;
            }
        } else {
            let numberSelected = storedNumberSelected[index];
            let intToString = numberSelected.toString();

            if (intToString.at(-3) === '.' || intToString.at(-2) === '.') {
                if (textArea.slice(-1) !== '.') {
                    if (intToString.slice(-3, -2) === '.') {
                        storedNumberSelected[index] = parseFloat(intToString.slice(0, -1));
                    } else if (intToString.slice(-3, -2) != '.') {
                        if ($("#text-area").text() === intToString) {
                            //remain the total with one digit decimal number.
                        } else {
                            storedNumberSelected[index] = parseFloat(intToString.slice(0, -1))
                        }
                    } else {
                        storedNumberSelected[index] = parseFloat(intToString.slice(0, -1))
                    }    
                }       
            } else if (textArea.at(-1) === '.' || textArea.at(-1) === '0') {
                if (intToString === '0') {
                    if (textArea.at(0) === '.') {
                        //remain the 0
                    } else {
                        storedNumberSelected.pop();
                    }
                } else if (intToString.at(-1) === '0') { 
                    storedNumberSelected.pop();
                    let stringToInt = intToString.slice(0, intToString.length-1);
                    storedNumberSelected[index] = parseFloat(stringToInt);
                } else {   
                    //remain the total without the decimal number.
                }
                dot = true;
                let textArea = $("#text-area").text();
                if (!ARITHMETIC_OPERATORS.includes(textArea.slice(-1))) {
                    clickButton = true;
                } else {
                    clickButton = false;
                }
            } else if (intToString.length >= 2) {
                storedNumberSelected.pop();
                let stringToInt = intToString.slice(0, intToString.length-1);
                storedNumberSelected[index] = parseFloat(stringToInt);
            } else {
                dot = true;
                storedNumberSelected.pop();
                clickButton = false;
            }

        }
    } else if (equalButtonClick_And_NoOperatorIncludes) {
        lastEquation();
    } else {
        $("#text-area").text('0');
        storedNumberSelected.pop();
        lastTextArea = "";
    }
    lengthOfTextArea--;
}

let indexForStoredNumbers = 0;
let storedNumberProcess = [];
let INDEX_SEQUENCE_VALUE = [];

function reset() {
    clickButton = true;
    dot = true;
    if (clickButton) {
        $("#text-area").text(0).css("font-size", "3rem");
    }
    $("#last-total").text("");
    storedNumberProcess = [];
    storedOperators = [];
    storedNumberSelected = [];
    newLengthOfTextArea = undefined;
    lastLengthOfTextArea = undefined;
    equalButtonClick_And_NoOperatorIncludes = false;
    index = 0;
    haveParenthesis = false;
    indexOfParenthesis = 0;
    backwardIndexCloseparenthesis = 0;
    indexForStoredNumbers = 0;
    INDEX_SEQUENCE_VALUE = [];
    parenthesisSequence = [];
}

function operatorOperation(operatorButton) {
    let textArea = $("#text-area").text();
    let lastChar = textArea.slice(-1);

    if (clickButton) {
        if ($("#text-area").text() === '0') {
            storedNumberSelected[index] = 0;
        } 
        equalButtonClick_And_NoOperatorIncludes = false;
        sequenceData();
        if (!ARITHMETIC_OPERATORS.includes(lastChar)) {
            displayClickedToTextArea(operatorButton);        
        } else {
            $("#text-area").text(textArea.slice(0, textArea.length-1) + operatorButton); 
        }   
        clickButton = false;
        dot = true;
    } else {
        const outsideOperator = -1;
        let inOrOutOperator = backwardIndexCloseparenthesis;
        inOrOutOperator--;
        const OPERATOR_INSIDE_OR_NONE = inOrOutOperator === outsideOperator
        ? textArea.slice(inOrOutOperator)
        : textArea.slice(inOrOutOperator).slice(0, backwardIndexCloseparenthesis); 
        if (clickButton || !ARITHMETIC_OPERATORS.includes(OPERATOR_INSIDE_OR_NONE)) {
            displayClickedToTextArea(operatorButton);   
        } else {
            if (ARITHMETIC_OPERATORS.includes(lastChar)) {
                $("#text-area").text(textArea.slice(0, textArea.length-1) + operatorButton);
            } else {
                $("#text-area").html(textArea.slice(0,inOrOutOperator) + operatorButton + produceGreyCloseParenthesis(indexOfParenthesis));
            }
        }
    }
    let indexForOperator = index-1;
    storedOperators[indexForOperator] = operatorButton;
}

const ADDITION = '+';
const SUBTRACTION = '−';
const MULTIPLICATION = '×';
const DIVISION = '÷';

function doMultiplyOrDivide(operator) {
    const NEW_VALUE_OPERATED = operator === MULTIPLICATION 
    ? storedNumberProcess[indexForStoredNumbers - 1] * storedNumberProcess[indexForStoredNumbers]
    : storedNumberProcess[indexForStoredNumbers - 1] / storedNumberProcess[indexForStoredNumbers];
    storedNumberProcess.pop();
    storedNumberProcess.push(NEW_VALUE_OPERATED);
    return NEW_VALUE_OPERATED;
}

function orderOfOperation(indexOfLoop, operator) {
    const NEXT_OPERATOR = storedOperators[indexOfLoop];
    storedNumberProcess.push(storedNumberSelected[indexOfLoop]);
    
    if ((NEXT_OPERATOR === MULTIPLICATION || NEXT_OPERATOR === DIVISION) && parenthesisSequence[indexOfLoop] != MULTIPLICATION) {
        doMultiplyOrDivide(operator);
        return 0;
    }

    return newTotal = doMultiplyOrDivide(operator);
}

function doAddOrSubtract(addOrMinus, indexOfLoop, operator) {
    let totalEqual = 0;
    return totalEqual = operator === SUBTRACTION || operator === ADDITION
    ? totalEqual = operator === SUBTRACTION
        ? totalEqual -= storedNumberSelected[indexOfLoop]
        : totalEqual += storedNumberSelected[indexOfLoop]
    : addOrMinus 
        ? totalEqual -= orderOfOperation(indexOfLoop, operator)
        : totalEqual += orderOfOperation(indexOfLoop, operator);
}

function arithmeticOperations(addOrMinus, indexOfLoop, operator) {
    const NEXT_OPERATOR = storedOperators[indexOfLoop];
    const IS_PARENTHESIS_INDEX = parenthesisSequence[indexOfLoop - 1] === MULTIPLICATION;

    if (IS_PARENTHESIS_INDEX) {
        storedNumberProcess.push(storedNumberSelected[indexOfLoop]);
        const isNextOpAddOrSub = NEXT_OPERATOR === ADDITION || NEXT_OPERATOR === SUBTRACTION
        ? storedNumberSelected[indexOfLoop]: 0;
        return totalEqual = isNextOpAddOrSub;
    }; 
    
    if (operator === ADDITION || operator === SUBTRACTION) {
        if ((NEXT_OPERATOR === MULTIPLICATION || NEXT_OPERATOR === DIVISION) && parenthesisSequence[indexOfLoop] !== MULTIPLICATION) {
            storedNumberProcess.push(storedNumberSelected[indexOfLoop]);
            return 0;
        };
    };

    return totalEqual = doAddOrSubtract(addOrMinus, indexOfLoop, operator); 
};

function isHaveAdditionOrSub(operator) {
    if (operator === ADDITION || operator === SUBTRACTION) {
        return false;
    } else {
        return true;
    }
}

function totalValue() {
    let isMinusOperator = false;
    let totalEqual = 0; 
    const ONLY_ONE_OPERATOR = 1;
    const copyOfStoredOperator = storedOperators.filter((valueOperator) => valueOperator);
    let startIndex = 1;

    for (let index = 0; index < storedNumberSelected.length; index++) {
        if(index != FIRST_INDEX) {
            const OPERATOR = storedOperators[index - 1];
            const NEXT_OPERATOR = storedOperators[index];
            const isParenthesisAfterOrNot = parenthesisSequence[index - 1] !== MULTIPLICATION;
            const isNotIndexOfParen = parenthesisSequence[index] !== MULTIPLICATION;
            const isNotLastIndex = parenthesisSequence.indexOf(MULTIPLICATION, index) !== -1;

            if (OPERATOR === ADDITION || OPERATOR === SUBTRACTION) {
                isMinusOperator = OPERATOR === SUBTRACTION;
            } 
            
            if (((OPERATOR === ADDITION || OPERATOR === SUBTRACTION) && (NEXT_OPERATOR === MULTIPLICATION || NEXT_OPERATOR === DIVISION) && isParenthesisAfterOrNot && isNotIndexOfParen && isNotLastIndex 
            && isHaveAdditionOrSub(storedOperators[index + 1]))) {
                INDEX_SEQUENCE_VALUE.push(totalEqual);
            } else if ( ((OPERATOR === ADDITION || OPERATOR === SUBTRACTION) && parenthesisSequence[index] === MULTIPLICATION)) {
                INDEX_SEQUENCE_VALUE.push(totalEqual);
            }
            
            let forTotal = 0;
            forTotal += arithmeticOperations(isMinusOperator, index, OPERATOR);
            totalEqual += forTotal;

            const isStoredOperatorNotHaveAddOrSub = !storedOperators.includes(ADDITION) && !storedOperators.includes(SUBTRACTION);

            if (parenthesisSequence[index]) {
                if (isStoredOperatorNotHaveAddOrSub) {
                    INDEX_SEQUENCE_VALUE.push(storedNumberProcess[index]);
                } else if (storedOperators[index - 1] === MULTIPLICATION || storedOperators[index - 1] === DIVISION) {
                    const toPositiveValue = forTotal.toString().slice(0,1) === '-' ? parseFloat(forTotal.toString().slice(1)): forTotal;
                    INDEX_SEQUENCE_VALUE.push(toPositiveValue);
                } else {
                    INDEX_SEQUENCE_VALUE.push(storedNumberSelected[index]);
                }
                totalEqual = 0;
                isMinusOperator = false;
            };

            if ( ((( (OPERATOR === MULTIPLICATION || OPERATOR === DIVISION) || 
                  ((OPERATOR === ADDITION || OPERATOR === SUBTRACTION) && ((index > parenthesisSequence.length || forTotal > 0 || forTotal < 0) && isNotIndexOfParen)) ) 
                  || ((OPERATOR === ADDITION || OPERATOR === SUBTRACTION) && ( (storedOperators[index + 1] === SUBTRACTION || storedOperators[index + 1] === ADDITION) || (storedOperators[parenthesisSequence.indexOf(MULTIPLICATION, index + 1) - 1] === SUBTRACTION || storedOperators[parenthesisSequence.indexOf(MULTIPLICATION, index + 1) - 1] === ADDITION)) 
                  && isNotIndexOfParen)) && isParenthesisAfterOrNot) ) {
                copyOfStoredOperator.splice(startIndex - 1, 1);
                startIndex--;
            };
            startIndex++;
            
            if (parenthesisSequence.length === ONLY_ONE_OPERATOR && storedNumberSelected.length - index === 1) {
                totalEqual = storedNumberProcess[0] * totalEqual;
            } else if (parenthesisSequence.length > ONLY_ONE_OPERATOR && storedNumberSelected.length - index === 1) {
                INDEX_SEQUENCE_VALUE.push(totalEqual);
                INDEX_SEQUENCE_VALUE.reverse();
                copyOfStoredOperator.reverse();
                for (let index2 = 0; index2 < copyOfStoredOperator.length; index2++) {
                    if (copyOfStoredOperator.length - index2 === 1) {
                        totalEqual = totalEqual * storedNumberProcess[0];
                    } else if (index2 === 0) {
                        const lastIndexValue = INDEX_SEQUENCE_VALUE[index2] * INDEX_SEQUENCE_VALUE[index2 + 1]; 
                        totalEqual = lastIndexValue;
                        INDEX_SEQUENCE_VALUE.splice(index2 + 1, 1);
                    } else if (copyOfStoredOperator[index2] === MULTIPLICATION) {
                        totalEqual = totalEqual * INDEX_SEQUENCE_VALUE[index2];
                    } else if (copyOfStoredOperator[index2] === SUBTRACTION) {
                        totalEqual = INDEX_SEQUENCE_VALUE[index2] - totalEqual;
                    } else if (copyOfStoredOperator[index2] === ADDITION) {
                        totalEqual = totalEqual + INDEX_SEQUENCE_VALUE[index2];
                    } else if (copyOfStoredOperator[index2] === DIVISION) {
                        totalEqual = totalEqual / INDEX_SEQUENCE_VALUE[index2];
                    };
                };
            };

            if (OPERATOR === MULTIPLICATION || OPERATOR === DIVISION || 
               (NEXT_OPERATOR === MULTIPLICATION && parenthesisSequence[index] !== MULTIPLICATION) || (NEXT_OPERATOR === DIVISION && isNotIndexOfParen)) {
                indexForStoredNumbers++;
            }

        } else {
            if (storedOperators[index] === MULTIPLICATION || storedOperators[index] === DIVISION) {
                storedNumberProcess.push(storedNumberSelected[index]);
                indexForStoredNumbers++;
            } else {
                totalEqual = storedNumberSelected[index];
            }
        }
    }

    if(clickButton) {
        if (totalEqual.toString() != $("#text-area").text()) {
            collectLastStoredData();
            //i will implement here a button that selects how many decimal they want.
            //Math.fround(totalEqual).toFixed(2);
            $("#text-area").text(totalEqual);

            let lastEquation = [];
            try {
                for(let i = 0; i <= index; i++) {
                    let data = storedNumberSelected[i];
                    let data2 = storedOperators[i-1];
                    if(i === 0){
                        lastEquation.push(data.toString());
                    }else {
                        lastEquation.push(data2);
                        lastEquation.push(data.toString());
                    }
                }
            } catch (error) {
                reset();
            }
            $("#last-total").text(lastEquation.join(" ") + " =");
            storedOperators = [];
            storedNumberSelected = [];
            index = 0;
            storedNumberSelected[index] = totalEqual;
            increaseFontSizeOrDecrease(totalEqual);   
            indexForStoredNumbers = 0;
            dot = true;
            equalButtonClick_And_NoOperatorIncludes = true;
        } else {
            animation();
        }
    } else {
        animation();
    }
    storedNumberProcess = [];
}

function collectLastStoredData() {
    lastTextArea = $("#text-area").text();
    if (equalButtonClick_And_NoOperatorIncludes === false) {
        lastStoredOperator = [];
        lastStoredNumberSelected = [];
    }
    for (let operatorsAndNumbers = 0; operatorsAndNumbers <= index; operatorsAndNumbers++) {
        lastStoredNumberSelected.push(storedNumberSelected[operatorsAndNumbers]);
        lastStoredOperator.push(storedOperators[operatorsAndNumbers]);
    }
    lastStoredOperator.pop();
    lastIndex = index;
}

function increaseFontSizeOrDecrease(totalEqual) {
    if ($("#text-area").width() >= 391) {
        $("#text-area").text(totalEqual).css("font-size", "2rem");
    } else if ($("#text-area").text(totalEqual).css("font-size") === "32px") {
        $("#text-area").text(totalEqual).css("font-size", "3rem");
        if ($("#text-area").width() > 390) {
            $("#text-area").text(totalEqual).css("font-size", "2rem");
        } else { 
            $("#text-area").text(totalEqual).css("font-size", "3rem");
        }
    }
}

function animation() {
    $("#text-area").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    $("#last-total").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}

function displayClickedToTextArea(clickedButton) {
    const FIRST_INDEX = 0;
    let textArea = $("#text-area").text();
    if (textArea.includes(closeParenthesis)) {
        if(textArea === "()") {
            $("#text-area").html('(' + clickedButton + closeParenthesis.fontcolor("gray"));
        } else {
            let previousCloseParenthesis = produceGreyCloseParenthesis(indexOfParenthesis);
            const STARTING_INDEX = storedNumberSelected.length !== 0 || (storedNumberSelected.length === 0 && textArea.charAt(FIRST_INDEX) === '(')
            ? 0 : 1;
            let previousDisplay = textArea.slice(STARTING_INDEX, backwardIndexCloseparenthesis) + clickedButton + previousCloseParenthesis;
            if (previousDisplay.at(lastLengthOfTextArea) === '0'){
                previousDisplay = previousDisplay.slice(STARTING_INDEX, lastLengthOfTextArea) + clickedButton + previousCloseParenthesis;
            }

            if (textArea.charAt(FIRST_INDEX) !== '(' && NUMBER_OPERATORS.includes(clickedButton)) {
                // condition for FIRST_INDEX is not open/close parenthesis
                $("#text-area").html(previousDisplay);
                if (nextIndex) {
                    storedOperators.push('×');
                    parenthesisSequence[index] = '×';
                    index++;
                    nextIndex = false
                } 
                clickButton = true;
            } else if (ARITHMETIC_OPERATORS.includes(clickedButton) && clickButton){
                $("#text-area").html(previousDisplay);
            }
        }
    } else {
        const FIRST_INDEXAfterOperator = lastLengthOfTextArea + 1;
        if (textArea.at(FIRST_INDEXAfterOperator) === '0' && textArea.at(FIRST_INDEXAfterOperator + 1) !== '.') {
            $("#text-area").text(textArea.slice(0, FIRST_INDEXAfterOperator) + clickedButton);
        } else {
            document.querySelector("#text-area").innerText += clickedButton;
        }
    }
}

function sequenceData() {
    index++;
    let textArea = $("#text-area").text();
    let lastLengthForParenthesis;
    if(textArea.slice(-1) === closeParenthesis) {
        lastLengthForParenthesis = textArea.slice(lastLengthOfTextArea).length - indexOfParenthesis;
        lastLengthForParenthesis = (lastLengthForParenthesis + lastLengthOfTextArea) + 1;
        lastLengthOfTextArea = lastLengthForParenthesis;
    } else { 
        lastLengthOfTextArea = $("#text-area").text().length;
    }
    newLengthOfTextArea = $("#text-area").text().length + 1;
}