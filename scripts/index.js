var index = 0;
var storedNumber = [];
var storedOperators = []
var indexForEqual = [];
var newLength;
var lastLength;
var click = true;

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
            selectedOperatorAppear(clickedButton);
            let data = $("#text-area").text();
            let previousNumber = data.slice(0, $("#text-area").text().length);
            storedNumber[index] = parseInt(previousNumber);
        } else if(click){
            indexZero(clickedButton);
            click = false;
        }
    } else if(operators.includes(clickedButton)) {
        calculatorOperator(clickedButton);
    } else if($("#text-area").text() != 0) {
        selectedOperatorAppear(clickedButton);
        let data = $("#text-area").text();

        if(newLength > lastLength) {
            if(indexForEqual.length === 1) {
                reset(clickedButton);
                $("#text-area").text(clickedButton);
                let previous = $("#text-area").text();
                let previousNumber = previous.slice(0, $("#text-area").text().length);
                storedNumber[index] = parseInt(previousNumber);
            } else {
                let nextNumber = data.slice(lastLength + 1, $("#text-area").text().length);
                storedNumber[index] = parseInt(nextNumber);
            }
        } else {
            let previousNumber = data.slice(0, $("#text-area").text().length);
            storedNumber[index] = parseInt(previousNumber);
        }
        click = true;
        console.log($("#text-area").text().length);
    } else {
        indexZero(clickedButton);
        $("#text-area").text(clickedButton);
    }
};

function indexZero (clickedButton) {
    clickedButton = parseInt(clickedButton);
    storedNumber[index] = clickedButton;
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
            total()
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
    indexForEqual = [];
    storedNumber = [];
    newLength = undefined;
    lastLength = undefined;
    index = 0;
}

function operatorOperation(operatorButton) {
    let textArea = $("#text-area").text();

    if(click) {
        if($("#text-area").text() === "0"){
            storedNumber[index] = 0;
        }
        indexForEqual = [];
        sequenceData()
        selectedOperatorAppear(operatorButton);
        click = false;
    } else {
        let lastUseOfOperator = textArea.slice(-1);
        if(lastUseOfOperator != operatorButton ) {
            $("#text-area").text(textArea.replace(lastUseOfOperator, operatorButton));
        }
    }
    storedOperators[index-1] = operatorButton;
    console.log(storedOperators[index-1])
}

function total() {
    let total = 0;
    let storeMultiple = []//

    if(storedOperators.includes('×') && $("text-area").length >= 2){
        console.log(storedOperators.indexOf('×'));
    }

    for(let i = 0; i < storedNumber.length; i++) {//2+3x3x2+2  2+3x3+2x3 // length = 5   3x3x3 //3                                   
        
        if(i >= 1) { // i = 4   ; total = 22  storeMultiple = [3,9,18]
            if(storedOperators[i-1] === '+' ){
                if(storedOperators[i] === '×'){
                    total = total;
                    storeMultiple.push(storedNumber[i]);
                } else {
                    total += storedNumber[i];
                }
            } else if(storedOperators[i-1] === '×'){
                storeMultiple.push(storedNumber[i]);//done
                let firstIndex = storedNumber[i-1] * storedNumber[i];
                if(storedOperators[i] === '+' && storedOperators[i-2] === '+' && storedOperators[i-1] === '×'){
                    total += firstIndex;
                } else {
                    let storedFirstIndex = 0;//9
                    if(storedOperators[i-1] === '×' && storedOperators[i-i] === '+'){
                        storedFirstIndex = 0;
                        storedFirstIndex = storeMultiple[i-2] * storeMultiple[i-1]
                        storeMultiple.pop();
                        storeMultiple.push(storedFirstIndex);
                        if(storedNumber.length - i === 1){
                            total += storeMultiple[i-1];
                        } else if (storedOperators[i] === '+'){
                            total += storeMultiple[i-1];
                        }
                    } else {
                        total *= storedNumber[i];
                    }
                }
            } else if(storedOperators[i-1] === '-'){
                total -= storedNumber[i];
            } else if(storedOperators[i-1] === '÷') {
                total /= storedNumber[i];
            }
        } else {
            total = storedNumber[i];
        }
    }

    if(click) {
        if(total != $("#text-area").text()) {
            if(total.toString().split('.')[1] >= 1){
                $("#text-area").text(total.toFixed(2));
            } else {
                $("#text-area").text(total);
            }
            indexForEqual.push("=");
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

function selectedOperatorAppear(clickedButton) {
    document.querySelector("#text-area").innerHTML += clickedButton;
}

function sequenceData() {
    index++;
    lastLength = $("#text-area").text().length;
    newLength = $("#text-area").text().length + 1;
}