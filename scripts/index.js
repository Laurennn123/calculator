let index = 0;
let preveiousIndex;
let indexForStoredNumbers = 0;
let indexForNewLength = 0;
let totalEqual = 0;
let storedNumberSelected = [];
let storedOperators = [];
let storedNumberProcess = [];
let newLengthOfTextArea;
let lastLengthOfTextArea;
let lastIndex;
let lastTextArea = "";
let lastStoredNumberSelected = [];
let lastStoredOperator = [];
let click = true;
let dot = true;
let equalButtonClick_And_NoOperatorIncludes = false;
let arithmethicOperators = ['+', '−', '÷', '×'];
let haveParenthesis = false;
let slicingBeforeCloseParenthesis = 0;
let indexOfParenthesis = 0;
let indexInsideOfParenthesis = 0;
let gettingValueStartAtOpenParenthesis;
const firstIndex = 0;
const openParenthesis = '(';
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
                if (textArea.at(firstIndex) === '.') {
                    $("#text-area").text('.');
                    displayClickedToTextArea(clickedButton);
                } else {
                    $("#text-area").text(clickedButton);
                }
                let newTextArea = $("#text-area").text();
                let newClickedNumber = newTextArea.slice(firstIndex, $("#text-area").text().length);
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
            let lastLengthOfTextAreaWithParenthesis = lastLengthOfTextArea; // 1 is for openParenthesis
            let lastChar = textArea.length - 1; 
            let startingIndex;
            if (textArea.charAt(lastChar) === closeParenthesis) {
                if(indexOfParenthesis === 1) {
                    startingIndex = lastLengthOfTextAreaWithParenthesis;
                } else {
                    startingIndex = gettingValueStartAtOpenParenthesis;
                }
                getNumberValueBeforeOperatorOrParenthesis = textArea.slice(startingIndex, slicingBeforeCloseParenthesis);
            } else {
                getNumberValueBeforeOperatorOrParenthesis = textArea.slice(firstIndex, $("#text-area").text().length);
            }
            storedNumberSelected[index] = parseFloat(getNumberValueBeforeOperatorOrParenthesis);
        }
        click = true;

    } else {
        let textArea = $("#text-area").text();
        if (textArea.charAt(firstIndex) === '.' && textArea.at(1) === '0') {
            displayClickedToTextArea(clickedButton);
        } else {
            firstNumberDisplay(clickedButton);
            $("#text-area").text(clickedButton);
        }
    }
};

function firstNumberDisplay (numberPicked) {
    numberPicked = parseInt(numberPicked);
    storedNumberSelected[index] = numberPicked;
}

function produceGreyCloseParenthesis (indexOfOpenAndClose) {
    let totalOfCloseParenthesis = '';
    while (indexOfOpenAndClose > 0) {
        totalOfCloseParenthesis += closeParenthesis.fontcolor("gray");
        indexOfOpenAndClose--;
    }
    return totalOfCloseParenthesis;
}

function calculatorOperator(operator) {
    switch (operator) {
        case '0':
            calculatorButtons('0');
            break;
        case '1':
            calculatorButtons('1');
            break;
        case '2':
            calculatorButtons('2');
            break;
        case '3':
            calculatorButtons('3');
            break;
        case '4':
            calculatorButtons('4');
            break;
        case '5':
            calculatorButtons('5');
            break;
        case '6':
            calculatorButtons('6');
            break;
        case '7':
            calculatorButtons('7');
            break;
        case '8':
            calculatorButtons('8');
            break;
        case '9':
            calculatorButtons('9');
            break;
        case '(':
            const mutilplicationSign = '×';
            let textArea = $("#text-area").text();
            let lastChar = textArea.slice(-1)
            let zero = '0';
            let empty = '';
            if (lastChar === mutilplicationSign) {  
                // no changes because of the operator that already initialize as multiplication
            } else if(textArea.slice(lastLengthOfTextArea, slicingBeforeCloseParenthesis) === empty && lastLengthOfTextArea !== undefined){
                // no changes due to no value 
            } else {
                let operator;
                if (arithmethicOperators.includes(lastChar)) {
                    operator = lastChar;
                } else {
                    operator = mutilplicationSign;
                }
                // to capture the sequence of containing number with operations
                if (storedNumberSelected.length === 0) {
                    //nothing will change because of not having number
                } else {
                    storedOperators[index] = operator;
                    index++;
                }
            }

            if ($("#text-area").text() === zero) {
                $("#text-area").html(openParenthesis + closeParenthesis.fontcolor("gray"));
                haveParenthesis = true;
            } else {
                let openAndCloseParenthesis = openParenthesis + closeParenthesis.fontcolor("gray");
                let previousCloseParenthesis = produceGreyCloseParenthesis(indexOfParenthesis);
                let haveValueAtNewParenthesis = haveParenthesis;
                if (haveValueAtNewParenthesis) {
                    $("#text-area").html(textArea.slice(firstIndex, slicingBeforeCloseParenthesis) + (openAndCloseParenthesis + previousCloseParenthesis));
                    haveValueAtNewParenthesis = false;
                } else {
                    if (indexOfParenthesis === parseInt(zero)) {
                        $("#text-area").html(textArea.slice(firstIndex) + (openParenthesis + closeParenthesis.fontcolor("gray")));
                    } else {
                        $("#text-area").html(textArea.slice(firstIndex, slicingBeforeCloseParenthesis) + (openParenthesis + previousCloseParenthesis + closeParenthesis.fontcolor("gray")));
                    }
                }
            }  
            indexOfParenthesis++;
            slicingBeforeCloseParenthesis--;
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
            break;
        case ')':
            if (haveParenthesis) {
                let textArea = $("#text-area").text();
                $("#text-area").html('(' + textArea.slice(1,-1) + ')');
                haveParenthesis = false;
            } else {
                // stay at no have parenthesis
            }
            break;        
        case '.':
            if (dot) {
                let textArea = $("#text-area").text();
                if ($("#text-area").text() === "0" || equalButtonClick_And_NoOperatorIncludes) {
                    storedNumberSelected[index] = 0;
                    $("#text-area").text('.');
                } else if (arithmethicOperators.includes(textArea.slice(-1))) {
                    $("#text-area").text(textArea.slice(0, textArea.length) + operator);
                    storedNumberSelected[index] = 0;
                } else if (!textArea.slice(0, textArea.length).includes('.') || !textArea.slice(lastLengthOfTextArea + 1, textArea.length).includes('.')) {
                    $("#text-area").text(textArea.slice(0, textArea.length) + operator);
                }
                click = true;
                dot = false;
            }
            break;
        case '+':
            operatorOperation(operator);
            break;
        case '-':
            operatorOperation('−');
            break;
        case '−':
            operatorOperation(operator);
            break;
        case '×':
            operatorOperation(operator);
            break;
        case '*':
            operatorOperation('×');
            break;
        case '/':
            operatorOperation('÷');
            break;
        case '÷':
            operatorOperation(operator);
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
            total();
            break;    
        case '=':
            total();
            break;
        default:
            break;
    }
}

function lastEquation(){
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

function remove(){
    let textArea = $("#text-area").text();
    let lengthOfTextArea = textArea.length;

    if (lengthOfTextArea >= 2) {
        document.querySelector("#text-area").innerHTML = textArea.slice(0, lengthOfTextArea-1);
        
        if (equalButtonClick_And_NoOperatorIncludes) {
            lastEquation();
        } else if (arithmethicOperators.includes(textArea.slice(-1))) {
            storedOperators.pop();
            click = true;
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
            }else if (textArea.at(-1) === '.' || textArea.at(-1) === '0') {
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
                if (!arithmethicOperators.includes(textArea.slice(-1))) {
                    click = true;
                } else {
                    click = false;
                }
            } else if (intToString.length >= 2) {
                storedNumberSelected.pop();
                let stringToInt = intToString.slice(0, intToString.length-1);
                storedNumberSelected[index] = parseFloat(stringToInt);
            } else {
                dot = true;
                storedNumberSelected.pop();
                click = false;
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

function reset() {
    click = true;
    dot = true;
    if (click) {
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
    indexInsideOfParenthesis = 0;
    slicingBeforeCloseParenthesis = 0;
}

function operatorOperation(operatorButton) {
    let textArea = $("#text-area").text();
    let lastChar = textArea.slice(-1);

    if (click) {
        if ($("#text-area").text() === "0") {
            storedNumberSelected[index] = 0;
        } 
        equalButtonClick_And_NoOperatorIncludes = false;
        indexForNewLength = lastLengthOfTextArea;
        sequenceData();
        if (!arithmethicOperators.includes(lastChar)) {
            displayClickedToTextArea(operatorButton);        
        } else {
            $("#text-area").text(textArea.slice(0, textArea.length-1) + operatorButton); 
        }   
        click = false;
        dot = true;
    } else {
        const outsideOperator = -1;
        let inOrOutOperator = slicingBeforeCloseParenthesis;
        inOrOutOperator--;
        let knowgHaveOperatorOrNone;
        if (inOrOutOperator === outsideOperator) {
            // for repeating clicked operator without open&close parenthesis and for else with open&close parenthesis
            knowgHaveOperatorOrNone = textArea.slice(inOrOutOperator);
        } else {
            knowgHaveOperatorOrNone = textArea.slice(inOrOutOperator).slice(0, slicingBeforeCloseParenthesis);
        }
        if (click || !arithmethicOperators.includes(knowgHaveOperatorOrNone)) {
            displayClickedToTextArea(operatorButton);   
        } else {
            if (arithmethicOperators.includes(lastChar)) {
                $("#text-area").text(textArea.slice(0, textArea.length-1) + operatorButton);
            } else {
                $("#text-area").html(textArea.slice(0,inOrOutOperator) + operatorButton + produceGreyCloseParenthesis(indexOfParenthesis));
            }
        }
    }
    let indexForOperator = index-1;
    storedOperators[indexForOperator] = operatorButton;
}

function priorityOperator(indexStoredNumber, operator) {
    const total = operator === '×' ? storedNumberProcess[indexStoredNumber-1] * storedNumberProcess[indexStoredNumber]:
    storedNumberProcess[indexStoredNumber-1] / storedNumberProcess[indexStoredNumber];
    storedNumberProcess.pop();
    storedNumberProcess.push(total);
    return total;
}

function orderOfOperation(indexOfLoop, indexOfStoredNumber, operator) {
    let newTotal = 0;
    let textArea = $("#text-area").text();
    let beforeNextOperator = storedOperators[indexOfLoop-1]; 
    let nextOperator = storedOperators[indexOfLoop];
    storedNumberProcess.push(storedNumberSelected[indexOfLoop]);

    if (nextOperator === '+' || nextOperator === '−') {
        if ( (nextOperator === '+' && textArea.slice(-1) === closeParenthesis) || (nextOperator === '−' && textArea.slice(-1) === closeParenthesis) ) {
            //added number in store process
            if (beforeNextOperator === '×' && indexOfLoop !== 1) {
                indexInsideOfParenthesis++;     
                newTotal = priorityOperator(indexOfLoop, operator);       
            }
        } else if (beforeNextOperator === '×') {
            newTotal = priorityOperator(indexOfStoredNumber, operator);
        } else {
            newTotal = priorityOperator(indexOfStoredNumber, operator);
        }
    } else if (textArea.slice(-1) === closeParenthesis && (storedNumberSelected.length - indexOfLoop) === 1) {
        indexInsideOfParenthesis++;
        // adding all of the number inside of parenthesis
        let valueOfLastOperation = priorityOperator(indexOfLoop, operator);
        storedNumberProcess.splice(indexOfParenthesis, indexInsideOfParenthesis);
        storedNumberProcess.splice(indexOfParenthesis, indexOfParenthesis, totalEqual + valueOfLastOperation);
        newTotal = priorityOperator(indexOfLoop - indexInsideOfParenthesis, operator) - totalEqual;
    } else if(textArea.slice(-1) === closeParenthesis && nextOperator === '×') {
        if (indexOfLoop === 1) {
            // to not multiplied at the first num after parenthesis
        } else {
            indexInsideOfParenthesis++;
            priorityOperator(indexOfLoop, operator);
        }
    } else if (nextOperator === '×' || nextOperator === '÷') {
        if(beforeNextOperator === '×' || beforeNextOperator === '÷') {
            priorityOperator(indexOfStoredNumber, operator);
        }
        newTotal = 0;
    } else if (beforeNextOperator === '+' || beforeNextOperator === '−') {
        newTotal = priorityOperator(indexOfStoredNumber, operator);
    } else if (beforeNextOperator === '×' || beforeNextOperator === '÷') {
        newTotal = priorityOperator(indexOfStoredNumber, operator);
        if(storedNumberProcess.length === 3 && operator === '÷'){
            let divideBeforeMultiply = storedNumberProcess[indexOfStoredNumber] / storedNumberProcess[indexOfStoredNumber-1];
            newTotal = divideBeforeMultiply;
        }
    }
    return newTotal;
}

function additionSubtractionPerform (indexOfStoredNumber, operator) {
    let totalValueWithParenthesis;
    //refactor later like on guidelines
    if (operator === '+') {
        totalValueWithParenthesis = storedNumberProcess[indexOfStoredNumber] + storedNumberProcess[indexOfStoredNumber + 1];
    } else {
        totalValueWithParenthesis = storedNumberProcess[indexOfStoredNumber] - storedNumberProcess[indexOfStoredNumber + 1];
    }
    return totalValueWithParenthesis;
}

function additionStoreProcess(indexIteration, operator) {
    storedNumberProcess.push(storedNumberSelected[indexIteration]);
    let getTotalOfallPlus = additionSubtractionPerform((indexIteration - 1) ,operator);
    storedNumberProcess.pop();
    storedNumberProcess.push(getTotalOfallPlus);
    return getTotalOfallPlus;
}

function additionOrSubtractionForTotal(indexIteration, operator) {
    let textArea = $("#text-area").text();
    let lastTermIndex = storedNumberSelected.length - indexIteration;
    if (storedOperators[indexIteration] === '×' || storedOperators[indexIteration] === '÷') {
        indexForStoredNumbers++;
        storedNumberProcess.push(storedNumberSelected[indexIteration]);
        indexInsideOfParenthesis++;
        if (indexIteration === 2) {
            totalEqual += storedNumberSelected[indexIteration - 1];
        }
    } else if (lastTermIndex === 1 && textArea.slice(-1) === closeParenthesis && !storedOperators.includes('×')) {
        additionStoreProcess(indexIteration, operator);
        storedOperators.reverse();
        totalEqual = priorityOperator(indexIteration - (indexInsideOfParenthesis + 1), storedOperators[indexIteration-1]);
    } else if (lastTermIndex === 1 && textArea.slice(-1) === closeParenthesis && storedOperators.includes('×')) {
        indexInsideOfParenthesis++;
        if (storedOperators[indexInsideOfParenthesis - 1] === '×' && indexInsideOfParenthesis !== 1) {
            storedNumberProcess.splice(indexIteration-1, indexOfParenthesis, totalEqual);
            totalEqual += additionStoreProcess(indexIteration, operator) - totalEqual;
        } else {
            totalEqual += additionStoreProcess(indexIteration, operator) - totalEqual;
        }
        storedNumberProcess.splice(indexOfParenthesis, indexInsideOfParenthesis);
        storedNumberProcess.splice(indexOfParenthesis, indexOfParenthesis, totalEqual);
        storedOperators.reverse();
        totalEqual = priorityOperator(indexIteration - indexInsideOfParenthesis, storedOperators[indexIteration - 1]);
    } else if ( (operator === '+' || operator === '−') && textArea.slice(-1) === closeParenthesis) {
        indexInsideOfParenthesis++;
        if (storedOperators[indexInsideOfParenthesis - 1] === '×' && indexInsideOfParenthesis !== 1) {
            storedNumberProcess.splice(indexIteration-1, indexOfParenthesis, totalEqual);
            totalEqual += additionStoreProcess(indexIteration, operator) - totalEqual;
        } else {
            totalEqual += additionStoreProcess(indexIteration, operator) - totalEqual;
        }
    } else if (operator === '−') {
        totalEqual -= storedNumberSelected[indexIteration];
    } else if (operator === '+') {
        totalEqual += storedNumberSelected[indexIteration];
    }
}

function multiplicationOrDivision(addOrMinus, indexIteration, indexStoredNumbers, operator) {
    indexForStoredNumbers++;
    if (addOrMinus) {
        totalEqual -= orderOfOperation(indexIteration, indexStoredNumbers, operator);
    } else {
        totalEqual += orderOfOperation(indexIteration, indexStoredNumbers, operator);
    }
}

function total() {
    totalEqual = 0;
    indexForStoredNumbers = 0;
    let operatorUsedAddOrMinus = false;
    
    for(let i = 0; i < storedNumberSelected.length; i++) {                               
        if(i >= 1) {
            let operator = storedOperators[i-1];  
            if (operator === '+' ) {
                additionOrSubtractionForTotal(i, '+');
                operatorUsedAddOrMinus = false;
            } else if (operator === '×') {
                multiplicationOrDivision(operatorUsedAddOrMinus, i, indexForStoredNumbers, '×');
            } else if (operator === '÷') {
                multiplicationOrDivision(operatorUsedAddOrMinus, i, indexForStoredNumbers, '÷');
            } else if (operator === '−') {
                additionOrSubtractionForTotal(i, '−');
                operatorUsedAddOrMinus = true;
            }
        } else {
            if(storedOperators[i] === '×' || storedOperators[i] === '÷'){
                storedNumberProcess.push(storedNumberSelected[i]);
                indexForStoredNumbers++;
            }else {
                totalEqual = storedNumberSelected[i];
            }
        }
    }

    if(click) {
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
            increaseFontSizeOrDecrease();   
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

function increaseFontSizeOrDecrease() {
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
    const firstIndex = 0;
    let textArea = $("#text-area").text();
    if (textArea.includes(closeParenthesis)) {
        if(textArea === "()") {
            $("#text-area").html(openParenthesis + clickedButton + closeParenthesis.fontcolor("gray"));
        } else {
            let totalOfCloseParenthesis = produceGreyCloseParenthesis(indexOfParenthesis);
            let startingPoint;
            if (storedNumberSelected.length !== 0 || (storedNumberSelected.length === 0 && textArea.charAt(firstIndex) === openParenthesis) ){
                startingPoint = 0;
            } else {
                startingPoint = 1;
            }
            let previousDisplay = textArea.slice(startingPoint, slicingBeforeCloseParenthesis);
            previousDisplay = previousDisplay + clickedButton;
            if (textArea.charAt(firstIndex) !== openParenthesis || clickedButton) {
                $("#text-area").html(previousDisplay + totalOfCloseParenthesis);
            } else {
                $("#text-area").html(openParenthesis + previousDisplay + totalOfCloseParenthesis);
            }
            haveParenthesis = true;
        }
    } else {
        document.querySelector("#text-area").innerText += clickedButton;
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