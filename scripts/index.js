var a = 0;
var storedNumber = [];
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

    if($("#text-area").text() === clickedButton && clickedButton === "0") {
        click = false;
    } else if(operators.includes(clickedButton)) {
        calculator(clickedButton);
    } else if($("#text-area").text() != 0) {
        document.querySelector("#text-area").innerHTML += $("#button" + clickedButton).text();
        let data = $("#text-area").text();
        if(newLength > lastLength) {
            let nextNumber = data.slice(lastLength + 1, $("#text-area").text().length);
            storedNumber[a] = parseInt(nextNumber);
        }else {
            let previousNumber = data.slice(0, $("#text-area").text().length);
            storedNumber[a] = parseInt(previousNumber);
        }
        click = true;
        console.log($("#text-area").text().length);
    } else {
        clickedButton = parseInt(clickedButton);
        storedNumber[a] = clickedButton;
        $("#text-area").text(clickedButton);
        console.log(typeof clickedButton);
    }
};

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
        if(storedNumber.length === 0 ){
            storedNumber[a] = 0;
        }
        sequenceData()
        document.querySelector("#text-area").innerHTML += plusSign;
        click = false;
    }
}

function total() {
    let previousTotal = [];
    let total = 0;
    for(let i = 0; i < storedNumber.length; i++){
        total += storedNumber[i];
    }
    previousTotal = [total];
    if(click) {
        $("#text-area").text(total);
        click = false;
    } 
    // else {
    //     var totalOf = previousTotal[0] += storedNumber[a];
    //     document.querySelector("#text-area").innerHTML + totalOf.toString();
    // }
}

function sequenceData() {
    a++;
    lastLength = $("#text-area").text().length;
    newLength = $("#text-area").text().length + 1;
}

// $("#plus").click( () => {

//     if(notClick) {
//         document.querySelector("#paragraph").innerHTML += $("#plus").text();
//         var index = $("#paragraph").text();
//         index = index.slice(0, index.length - 1)
//         lastLength = index;
//         storedNumber.push(parseInt(index));
//         notClick = false;
//     }
     
// })

// $("#equal").click( () => {
    
//     if(notClick) {
//         var index = $("#paragraph").text();
//         index = index.slice(lastLength.length, index.length + 1);
//         storedNumber.push(parseInt(index));
//         $("#paragraph").html(storedNumber[0] + storedNumber[1]);
//         notClick = false;
//     }

// });