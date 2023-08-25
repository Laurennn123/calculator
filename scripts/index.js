var index = 0;
var indexForStoredNumbers = 0;
var totalEqual = 0;
var storedNumberSelected = [];
var storedOperators = [];
var storedNumberProcess = [];
var newLengthOfTextArea;
var lastLengthOfTextArea;
var click = true;
var equalButtonClick_And_NoOperatorIncludes = false;

for(let i = 0; i < $(".calculatorButtons").length; i++) {
    document.querySelectorAll(".calculatorButtons")[i].addEventListener("click", function() {
        let clickedButton = this.textContent;
        calculatorButtons(clickedButton);
        $("#button" + clickedButton).fadeOut(100).fadeIn(100);
    });
};

function calculatorButtons(clickedButton) {
    let operators = ['+', '-', '×', '÷', '=', 'CE'];

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
                storedNumberSelected[index] = parseInt(getNextNumberAfterOperator);
            }
        } else {
            let getNumberBeforeOperator = textArea.slice(0, $("#text-area").text().length);
            storedNumberSelected[index] = parseInt(getNumberBeforeOperator);
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
        case '+':
            operatorOperation(operator);
            break;
        case '-':
            operatorOperation(operator);
            break;
        case '×':
            operatorOperation(operator);
            break;
        case '÷':
            operatorOperation(operator);
            break;
        case 'CE':
            reset();
            break;    
        case '=':
            total();
            break;
        default:
            break;
    }
}

function reset() {
    click = true;
    if(click) {
        $("#text-area").text(0);
    } 
    storedNumberProcess = [];
    storedOperators = [];
    storedNumberSelected = [];
    newLengthOfTextArea = undefined;
    lastLengthOfTextArea = undefined;
    index = 0;
}

function operatorOperation(operatorButton) {
    let textArea = $("#text-area").text();

    if(click) {
        if($("#text-area").text() === "0"){
            storedNumberSelected[index] = 0;
        }
        equalButtonClick_And_NoOperatorIncludes = false;
        sequenceData()
        displayClickedToTextArea(operatorButton);
        click = false;
    } else {
        $("#text-area").text(textArea.replace(textArea.slice(-1), operatorButton));
    }
    storedOperators[index-1] = operatorButton;
    console.log(storedOperators[index-1])
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

function orderOfOperation(indexOfLoop, indexOfStoredNumber, operator) {//4,2,times
    let newTotal = 0;
    storedNumberProcess.push(storedNumberSelected[indexOfLoop]);

    if(storedOperators[indexOfLoop] === '+' || storedOperators[indexOfLoop] === '-'){
        if(storedOperators[indexOfLoop-1] === '×'){
            newTotal = priorityOperator(indexOfStoredNumber, operator);
        }else {
            newTotal = storedNumberProcess[indexOfStoredNumber-1] / storedNumberProcess[indexOfStoredNumber];
        }
    }else if(storedOperators[indexOfLoop] === '×'){
        if(storedOperators[indexOfLoop-1] === '×' || storedOperators[indexOfLoop-1] === '÷'){
            newTotal = priorityOperator(indexOfStoredNumber, operator);
        }
        newTotal = 0;
    }else if(storedOperators[indexOfLoop] === '÷'){
        newTotal = priorityOperator(indexOfStoredNumber, operator);
        newTotal = 0;
    }else if(storedOperators[indexOfLoop-1] === '+' || storedOperators[indexOfLoop-1] === '-'){
        newTotal = priorityOperator(indexOfStoredNumber, operator);
    }else if(storedOperators[indexOfLoop-1] === '×') {
        newTotal = priorityOperator(indexOfStoredNumber, operator);
        if(storedNumberProcess.length === 3 && operator === '÷'){
            let divideBeforeMultiply = storedNumberProcess[indexOfStoredNumber] / storedNumberProcess[indexOfStoredNumber-1];
            newTotal = divideBeforeMultiply;
        }
    }else if(storedOperators[indexOfLoop-1] === '÷'){
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
            if(storedOperators[i-1] === '+' ){
                additionOrSubtraction(i, '+');
                operatorUsedAddOrMinus = false;
            } else if(storedOperators[i-1] === '×'){
                multiplicationOrDivision(operatorUsedAddOrMinus, i, indexForStoredNumbers, '×');
            } else if(storedOperators[i-1] === '÷'){
                multiplicationOrDivision(operatorUsedAddOrMinus, i, indexForStoredNumbers, '÷');
            } else if(storedOperators[i-1] === '-') {
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
            if(totalEqual.toString().split('.')[1] >= 1){
                $("#text-area").text(totalEqual.toFixed(2));
            } else {
                $("#text-area").text(totalEqual);
                storedOperators = [];
                storedNumberProcess = [];
                storedNumberSelected = [];
                index = 0;
                storedNumberSelected[index] = totalEqual;
            }
            equalButtonClick_And_NoOperatorIncludes = true;
        } else {
            animation();
        }
    } else {
        animation();
    }

}

function animation() {
    $("#text-area").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}

function displayClickedToTextArea(clickedButton) {
    document.querySelector("#text-area").innerHTML += clickedButton;
}

function sequenceData() {
    index++;
    lastLengthOfTextArea = $("#text-area").text().length;
    newLengthOfTextArea = $("#text-area").text().length + 1;
}