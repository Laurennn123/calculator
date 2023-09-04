var index = 0;
var indexForStoredNumbers = 0;
var indexForNewLength = 0;
var totalEqual = 0;
var storedNumberSelected = [];
var storedOperators = [];
var storedNumberProcess = [];
var newLengthOfTextArea;
var lastLengthOfTextArea;
var lastIndex;
var lastTextArea = "";
var lastStoredNumberSelected = [];
var lastStoredOperator = [];
var click = true;
var dot = true;
var equalButtonClick_And_NoOperatorIncludes = false;

for(let i = 0; i < $(".calculatorButtons").length; i++) {
    document.querySelectorAll(".calculatorButtons")[i].addEventListener("click", function() {
        let clickedButton = this.textContent;
        calculatorButtons(clickedButton);
        $("#button" + clickedButton).fadeOut(100).fadeIn(100);
    });
};

document.addEventListener("keydown", function(event){
    calculatorOperator(event.key);
});

function calculatorButtons(clickedButton) {
    let operators = ['+', '-', '×', '÷', '=', 'CE', '⌫', '.'];

    if(clickedButton === 0) {
        if($("#text-area").text() >= 1) {
            displayClickedToTextArea(clickedButton);
            let textArea = $("#text-area").text();
            let zeroDisplay = textArea.slice(0, $("#text-area").text().length);
            storedNumberSelected[index] = parseInt(zeroDisplay);
        } else if(click){
            firstNumberDisplay(clickedButton);
            click = false;
        }
    } else if(operators.includes(clickedButton)) {
        calculatorOperator(clickedButton);
    } else if($("#text-area").text() != 0) {
        let lengthOfTextArea = $("#text-area").text().length;
        if(lengthOfTextArea === 12){
            $("#text-area").css("font-size", "3rem");
        }else if(lengthOfTextArea === 15) {
            $("#text-area").css("font-size", "2rem");
        }else if(lengthOfTextArea === 23){
            $("#text-area").css("font-size", "1.7rem");
        }
        displayClickedToTextArea(clickedButton);
        let textArea = $("#text-area").text();

        if(newLengthOfTextArea > lastLengthOfTextArea) {
            if(equalButtonClick_And_NoOperatorIncludes) {
                reset();
                $("#text-area").text(clickedButton);
                let newTextArea = $("#text-area").text();
                let newClickedNumber = newTextArea.slice(0, $("#text-area").text().length);
                storedNumberSelected[index] = parseInt(newClickedNumber);
                equalButtonClick_And_NoOperatorIncludes = false;
            } else {
                let getNextNumberAfterOperator = textArea.slice(lastLengthOfTextArea + 1, $("#text-area").text().length);
                storedNumberSelected[index] = parseFloat(getNextNumberAfterOperator);
            }
        } else {
            let getNumberBeforeOperator = textArea.slice(0, $("#text-area").text().length);
            storedNumberSelected[index] = parseFloat(getNumberBeforeOperator);
        }
        click = true;

    } else {
        firstNumberDisplay(clickedButton);
        $("#text-area").text(clickedButton);
    }
};

function firstNumberDisplay (numberPicked) {
    numberPicked = parseInt(numberPicked);
    storedNumberSelected[index] = numberPicked;
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
        case '.':
            if(dot){
                let textArea = $("#text-area").text();

                if($("#text-area").text() === "0"){
                    storedNumberSelected[index] = 0;
                    $("#text-area").text('.')
                }else if(!textArea.slice(0, textArea.length).includes('.')){
                    $("#text-area").text(textArea.slice(0, textArea.length) + operator);
                }else if(!textArea.slice(lastLengthOfTextArea + 1, textArea.length).includes('.')){
                    $("#text-area").text(textArea.slice(0, textArea.length) + operator);
                }
                dot = false;
            }
            break;
        case '+':
            operatorOperation(operator);
            break;
        case '-':
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
    storedOperators.pop();
    index = lastIndex;
    lastStoredOperator = [];
    lastStoredNumberSelected = [];
    equalButtonClick_And_NoOperatorIncludes = false;
}

function remove(){
    let textArea = $("#text-area").text();
    let lengthOfTextArea = textArea.length;
    let operators = ['+', '-', '×', '÷'];

    if(lengthOfTextArea >= 2) {
        document.querySelector("#text-area").innerHTML = textArea.slice(0, lengthOfTextArea-1);
        
        if(equalButtonClick_And_NoOperatorIncludes){
            lastEquation();
        }else if(operators.includes(textArea.slice(-1))){
            storedOperators.pop();
            click = true;
            index--;
            if(storedOperators.length === 0){
                newLengthOfTextArea = undefined;
                lastLengthOfTextArea = undefined;
            } else {
                let lastNumberIndex = storedNumberSelected[index];
                lastLengthOfTextArea -= lastNumberIndex.toString().length+1;
            }
        }else {
            let numberSelected = storedNumberSelected[index];
            let intToString = numberSelected.toString();

            if(intToString.at(-3) === '.' || intToString.at(-2) === '.'){
                if(textArea.slice(-1) !== '.'){
                    if(intToString.slice(-3, -2) === '.'){
                        storedNumberSelected[index] = parseFloat(intToString.slice(0, -1));
                    }else if(intToString.slice(-3, -2) != '.'){
                        if($("#text-area").text() === intToString){
                            //remain the total with one digit decimal number.
                        }else {
                            storedNumberSelected[index] = parseFloat(intToString.slice(0, -1))
                        }
                    }else {
                        storedNumberSelected[index] = parseFloat(intToString.slice(0, -1))
                    }    
                }       
            }else if(textArea.at(-1) === '.'){
                if(intToString === '0'){
                    storedNumberSelected.pop();
                }else {
                     //remain the total without the decimal number.
                }
                dot = true;
            }else if(intToString.length >= 2){
                storedNumberSelected.pop();
                let stringToInt = intToString.slice(0, intToString.length-1);
                storedNumberSelected[index] = parseFloat(stringToInt);
            }else {
                storedNumberSelected.pop();
                click = false;
            }

        }
    }else if(equalButtonClick_And_NoOperatorIncludes){
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
    if(click) {
        $("#text-area").text(0);
    } 
    storedNumberProcess = [];
    storedOperators = [];
    storedNumberSelected = [];
    newLengthOfTextArea = undefined;
    lastLengthOfTextArea = undefined;
    index = 0;
    $("#text-area").css("font-size", "4rem");
}

function operatorOperation(operatorButton) {
    let textArea = $("#text-area").text();
    if(click) {
        if($("#text-area").text() === "0"){
            storedNumberSelected[index] = 0;
        } 
        equalButtonClick_And_NoOperatorIncludes = false;
        indexForNewLength = lastLengthOfTextArea;
        sequenceData()
        let operators = ['+', '-', '×', '÷'];
        if(!operators.includes(textArea.slice(-1))){
            displayClickedToTextArea(operatorButton);       
        }else {
            $("#text-area").text(textArea.slice(0, textArea.length-1) + operatorButton);
        }   
        click = false;
        dot = true;
    } else {
        $("#text-area").text(textArea.slice(0, textArea.length-1) + operatorButton);
    }
    storedOperators[index-1] = operatorButton;
}

function priorityOperator(indexStoredNumber, operator) {
    let total = 0;
    
    if(operator === '×') {
        total = storedNumberProcess[indexStoredNumber-1] * storedNumberProcess[indexStoredNumber];
    }else {
        total = storedNumberProcess[indexStoredNumber-1] / storedNumberProcess[indexStoredNumber];
    }

    storedNumberProcess.pop();
    storedNumberProcess.push(total);
    return total;
}

function orderOfOperation(indexOfLoop, indexOfStoredNumber, operator) {
    let newTotal = 0;
    let beforeNextOperator = storedOperators[indexOfLoop-1]; 
    let nextOperator = storedOperators[indexOfLoop];
    storedNumberProcess.push(storedNumberSelected[indexOfLoop]);

    if(nextOperator === '+' || nextOperator === '-'){
        if(beforeNextOperator === '×'){
            newTotal = priorityOperator(indexOfStoredNumber, operator);
        }else {
            newTotal = storedNumberProcess[indexOfStoredNumber-1] / storedNumberProcess[indexOfStoredNumber];
        }
    }else if(nextOperator === '×'){
        if(beforeNextOperator === '×' || beforeNextOperator === '÷'){
            newTotal = priorityOperator(indexOfStoredNumber, operator);
        }
        newTotal = 0;
    }else if(nextOperator === '÷'){
        newTotal = priorityOperator(indexOfStoredNumber, operator);
        newTotal = 0;
    }else if(beforeNextOperator === '+' || beforeNextOperator === '-'){
        newTotal = priorityOperator(indexOfStoredNumber, operator);
    }else if(beforeNextOperator === '×') {
        newTotal = priorityOperator(indexOfStoredNumber, operator);
        if(storedNumberProcess.length === 3 && operator === '÷'){
            let divideBeforeMultiply = storedNumberProcess[indexOfStoredNumber] / storedNumberProcess[indexOfStoredNumber-1];
            newTotal = divideBeforeMultiply;
        }
    }else if(beforeNextOperator === '÷'){
        let equalOf = storedNumberProcess[indexOfStoredNumber-1] / storedNumberProcess[indexOfStoredNumber];
        newTotal = equalOf;
    }

    return newTotal;
}

function additionOrSubtraction(indexIteration, operator){
    if(storedOperators[indexIteration] === '×' || storedOperators[indexIteration] === '÷'){
        indexForStoredNumbers++;
        storedNumberProcess.push(storedNumberSelected[indexIteration]);
    }else if(operator === '-') {
        totalEqual -= storedNumberSelected[indexIteration];
    }else if(operator === '+'){
        totalEqual += storedNumberSelected[indexIteration];
    }
}

function multiplicationOrDivision(addOrMinus, indexIteration, indexStoredNumbers, operator){
    indexForStoredNumbers++;
    if(addOrMinus){
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
            if(operator === '+' ){
                additionOrSubtraction(i, '+');
                operatorUsedAddOrMinus = false;
            } else if(operator === '×'){
                multiplicationOrDivision(operatorUsedAddOrMinus, i, indexForStoredNumbers, '×');
            } else if(operator === '÷'){
                multiplicationOrDivision(operatorUsedAddOrMinus, i, indexForStoredNumbers, '÷');
            } else if(operator === '-') {
                additionOrSubtraction(i, '-');
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
        if(totalEqual != $("#text-area").text()) {
            collectLastStoredData();
            if(totalEqual.toString().split('.')[1] >= 1){
                $("#text-area").text(totalEqual.toFixed(2));
            } else {
                $("#text-area").text(totalEqual);
            }
            storedOperators = [];
            storedNumberProcess = [];
            storedNumberSelected = [];
            index = 0;
            storedNumberSelected[index] = Math.round(totalEqual*100)/100;
            equalButtonClick_And_NoOperatorIncludes = true;
        } else {
            animation();
        }
    } else {
        animation();
    }

}

function collectLastStoredData() {
    lastTextArea = $("#text-area").text();
    if(equalButtonClick_And_NoOperatorIncludes === false){
        lastStoredOperator = [];
        lastStoredNumberSelected = [];
    }
    for(let operatorsAndNumbers = 0; operatorsAndNumbers <= index; operatorsAndNumbers++){
        lastStoredNumberSelected.push(storedNumberSelected[operatorsAndNumbers]);
        lastStoredOperator.push(storedOperators[operatorsAndNumbers]);
    }
    lastStoredOperator.pop();
    lastIndex = index;
}

function animation() {
    $("#text-area").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}

function displayClickedToTextArea(clickedButton) {
    document.querySelector("#text-area").innerText += clickedButton;
}

function sequenceData() {
    index++;
    lastLengthOfTextArea = $("#text-area").text().length;
    newLengthOfTextArea = $("#text-area").text().length + 1;
}