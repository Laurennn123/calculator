var storedNumber = [];
var lastLength;
var notClick = true;

$("#number1").click( () => {
    parseInt(document.querySelector("#paragraph").innerHTML += $("#number1").text());
    console.log($("#paragraph").text().length);
    notClick = true;
});

$("#plus").click( () => {

    if(notClick) {
        document.querySelector("#paragraph").innerHTML += $("#plus").text();
        var index = $("#paragraph").text();
        index = index.slice(0, index.length - 1)
        lastLength = index;
        storedNumber.push(parseInt(index));
        notClick = false;
    }
     
})

$("#equal").click( () => {
    
    if(notClick) {
        var index = $("#paragraph").text();
        index = index.slice(lastLength.length, index2.length + 1);
        storedNumber.push(parseInt(index));
        console.log(storedNumber[0] + storedNumber[1]);
        notClick = false;
    }

});
