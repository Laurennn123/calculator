var a = 0;
var storedNumber = [];
var indexForEqual = [];
var click = true;
var newLength;
var lastLength;

for(let i = 0; i < $(".calculatorButtons").length; i++) {
    document.querySelectorAll(".calculatorButtons")[i].addEventListener("click", function() {
        let clickedButton = this.textContent;
        calculatorButtons(clickedButton);
    });
};

function calculatorButtons(clickedButton) {
    let operators = ["+", "-", "/", "*", "="];

    if(clickedButton === 0) {
        if($("#text-area").text() >= 1) {
            appear(clickedButton);
            let data = $("#text-area").text();
            let previousNumber = data.slice(0, $("#text-area").text().length);
            storedNumber[a] = parseInt(previousNumber);
        } else if(click){
            indexZero(clickedButton);
            click = false;
        }
    } else if(operators.includes(clickedButton)) {
        calculator(clickedButton);
    } else if($("#text-area").text() != 0) {
        appear(clickedButton);
        let data = $("#text-area").text();

        if(newLength > lastLength) {
            if(indexForEqual.length === 1) {
                indexForEqual = [];
                storedNumber = [];
                newLength = undefined;
                lastLength = undefined;
                a = 0;
                $("#text-area").text(clickedButton);
                let previous = $("#text-area").text();
                let previousNumber = previous.slice(0, $("#text-area").text().length);
                storedNumber[a] = parseInt(previousNumber);
            } else {
                let nextNumber = data.slice(lastLength + 1, $("#text-area").text().length);
                storedNumber[a] = parseInt(nextNumber);
            }
        } else {
            let previousNumber = data.slice(0, $("#text-area").text().length);
            storedNumber[a] = parseInt(previousNumber);
        }
        click = true;
        console.log($("#text-area").text().length);
    } else {
        indexZero(clickedButton);
        $("#text-area").text(clickedButton);
    }
};

function appear(clickedButton) {
    document.querySelector("#text-area").innerHTML += $("#button" + clickedButton).text();
}

function indexZero (clickedButton) {
    clickedButton = parseInt(clickedButton);
    storedNumber[a] = clickedButton;
}

function calculator(operator) {
    switch (operator) {
        case "+":
            add(operator);
            break;
        case "=":
            total()
            break;
        default:
            break;
    }
}

function add(plusSign) {
    if(click) {
        if($("#text-area").text() === "0"){
            storedNumber[a] = 0;
        }
        indexForEqual = [];
        sequenceData()
        document.querySelector("#text-area").innerHTML += plusSign;
        click = false;
    }
}

function total() {
    let total = 0;
    for(let i = 0; i < storedNumber.length; i++){
        total += storedNumber[i];
    }
    
    if(click) {
        if(total != $("#text-area").text()) {
            $("#text-area").text(total);
            indexForEqual.push("=");
        } else {
            $("#text-area").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        }
    } 

}

function sequenceData() {
    a++;
    lastLength = $("#text-area").text().length;
    newLength = $("#text-area").text().length + 1;
}