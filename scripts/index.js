var index = 0;
var storedMultiple = [];
var storedDivision = [];
var storedNumber = [];
var storedOperators = []
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
            storedNumber[index] = parseInt(zeroDisplay);
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
                storedNumber[index] = parseInt(newClickedNumber);
                equalButtonClick_And_NoOperatorIncludes = false;
            } else {
                let getNextNumberAfterOperator = textArea.slice(lastLengthOfTextArea + 1, $("#text-area").text().length);
                storedNumber[index] = parseInt(getNextNumberAfterOperator);
            }
        } else {
            let getNumberBeforeOperator = textArea.slice(0, $("#text-area").text().length);
            storedNumber[index] = parseInt(getNumberBeforeOperator);
        }
        click = true;

    } else {
        firstNumberDisplay(clickedButton);
        $("#text-area").text(clickedButton);
    }
};

function firstNumberDisplay (numberPicked) {
    numberPicked = parseInt(numberPicked);
    storedNumber[index] = numberPicked;
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
    storedMultiple = [];
    storedOperators = [];
    storedNumber = [];
    newLengthOfTextArea = undefined;
    lastLengthOfTextArea = undefined;
    index = 0;
}

function operatorOperation(operatorButton) {
    let textArea = $("#text-area").text();

    if(click) {
        if($("#text-area").text() === "0"){
            storedNumber[index] = 0;
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

function total() {
    let total = 0;
    let storedMultipleEqual = 0;
    let indexForMultiple = 0;
 
    for(let i = 0; i < storedNumber.length; i++) {//2+3x3x2+2  2+3x3+2x3 // length = 5   3x3x3 //3                                   
        if(i >= 1) { // i = 2    total = 20  storedMultiple = [3,9,9,2] 3+3+3x2 3x3+2 = 11+2
            if(storedOperators[i-1] === '+' ){
                if(storedOperators[i] === '×'){
                    storedMultiple.push(storedNumber[i]);
                    indexForMultiple++;
                }else if(storedOperators[i] === '÷') {
                    storedDivision.push(storedNumber[i])
                }else {
                     total += storedNumber[i];
                }
            } else if(storedOperators[i-1] === '×'){
                storedMultiple.push(storedNumber[i]);  
                storedMultipleEqual = storedMultiple[indexForMultiple-1] * storedMultiple[indexForMultiple];
                storedMultiple.pop();   
                storedMultiple.push(storedMultipleEqual);
                if(storedOperators[i] === '+'){
                    total += storedMultipleEqual;
                } else if(storedOperators[i] === '×'){
                    storedMultipleEqual = 0;   
                } else if(storedOperators[i-1] === '×'){
                    total += storedMultipleEqual;
                }else {
                    total *= storedNumber[i]; 
                }
                storedMultipleEqual = 0;  
                indexForMultiple++;  
            } else if(storedOperators[i-1] === '-'){
                total -= storedNumber[i];
            } else if(storedOperators[i-1] === '÷') {
                total /= storedNumber[i];
            }
        } else {
            if(storedOperators[i] === '×'){
                storedMultiple.push(storedNumber[i]);
                indexForMultiple++;
            } else {
                total = storedNumber[i];
            }
        }
    }

    if(click) {
        if(total != $("#text-area").text()) {
            if(total.toString().split('.')[1] >= 1){
                $("#text-area").text(total.toFixed(2));
            } else {
                $("#text-area").text(total);
                storedMultiple = [];
                storedOperators = [];
                storedNumber = [];
                index = 0;
                storedNumber[index] = total;
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