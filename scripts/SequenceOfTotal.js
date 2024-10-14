const OPEN_PAREN = '(';
const CLOSE_PAREN = ')';
const arithmeticOperators = ['+', '−', '×', '÷']; 
const [ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION] = arithmeticOperators;

const operations = (operator, num1, num2) => {
    let newValue;
    switch (operator) {
        case '+':
            newValue = num1 + num2;
            break;
        case '−':
            newValue = num1 - num2;
            break;
        case '×':
            newValue = num1 * num2;
            break;
        case '÷':
            newValue = num1 / num2;
            break;
    }
    return newValue;
};

const removingElement = (arrIndexRemove, storedNumberSelected, storedOperators) => {
    for (let i = 0; i < arrIndexRemove.length; i++) {
        const indexRemove = arrIndexRemove[i];
        storedNumberSelected.splice(indexRemove, 1);
        storedOperators.splice(indexRemove, 1);
        if (arrIndexRemove[i + 1] !== undefined) arrIndexRemove[i + 1] = arrIndexRemove[i + 1] - (i + 1);
    }
    return storedNumberSelected, storedOperators;
};

let indexForRemove = [];

const multiplyAndDivide = (storedNumberSelected, storedOperators) => {
    for (let index = 0; index < storedOperators.length; index++) {
        const currOperator = storedOperators[index];

        if (currOperator === CLOSE_PAREN) {
            storedOperators.splice(index, 1);
            continue;   
        }

        if (currOperator === MULTIPLICATION || currOperator === DIVISION) {
            const newValue = operations(currOperator, storedNumberSelected[index], storedNumberSelected[index + 1]);
            indexForRemove.push(index);
            storedNumberSelected[index + 1] = newValue;
        } 
    }
    return storedNumberSelected, storedOperators;
};

const plusAndMinus = (storedNumberSelected, storedOperators) => {
    const isHaveCloseParen = storedOperators.includes(CLOSE_PAREN) ? true : false;

    for (let i = 0; i < storedOperators.length; i++) {
        const currOperator = storedOperators[i];
        const nextOperator = storedOperators[i + 1];
        const prevOperator = storedOperators[i - 1];
        const operatorNotInclude = [MULTIPLICATION, DIVISION, CLOSE_PAREN];

        if (currOperator === CLOSE_PAREN) {
            storedOperators.splice(i, 1);
            continue;
        }
        
        if ((currOperator === ADDITION || currOperator === SUBTRACTION) && nextOperator !== OPEN_PAREN && !operatorNotInclude.includes(prevOperator)) {
            if (prevOperator === SUBTRACTION && nextOperator === undefined && isHaveCloseParen) {
                continue;
            };
            const newValue = operations(currOperator, storedNumberSelected[i], storedNumberSelected[i + 1]);
            indexForRemove.push(i);
            storedNumberSelected[i + 1] = newValue;
        }
    }
    return storedNumberSelected, storedOperators;
};

const calculateTotal = (storedNumberSelected, storedOperators) => {
    let indexOpenParen = 0;
    const splittedText = $("#text-area").text().split('');

    const operatorThenParen = splittedText.reduce((indices, element, index) => {
        if (element === OPEN_PAREN) indexOpenParen++;
        if (element === OPEN_PAREN && arithmeticOperators.includes(splittedText[index - 1]) && splittedText[index - 1] !== undefined){
            indices[indexOpenParen] = splittedText[index - 1];
        }; 
        return indices;
    },{});

    indexOpenParen = 0;
    const indexOfCloseParen = {};
    const spliceIndex = {};
    
    for (let i = 0; i < storedOperators.length; i++) {
        const currOperator = storedOperators[i];
        const nextOperator = storedOperators[i + 1];

        if (currOperator === OPEN_PAREN) {
            indexOpenParen++;
            if (operatorThenParen[indexOpenParen]) storedOperators.splice(i - 1, 1);
        } else if (currOperator === CLOSE_PAREN) {
            indexOfCloseParen[indexOpenParen] = nextOperator;
            const plusNMinus = ['+', '−'];
            let plusIndex = 1;
            let j = i;
            
            while (storedOperators[j] !== OPEN_PAREN) {
                if (plusNMinus.includes(storedOperators[j])) plusIndex++;
                j--;
            }

            spliceIndex[indexOpenParen] = plusIndex;
        }
    }

    multiplyAndDivide(storedNumberSelected, storedOperators);
    removingElement(indexForRemove, storedNumberSelected, storedOperators);

    indexOpenParen = 0;
    let loopStart = 0;

    for (const index in spliceIndex) {
        const openParenTarget = parseInt(index);
        for (let i = loopStart; i < storedOperators.length; i++) {
            if (storedOperators[i] === OPEN_PAREN) {
                indexOpenParen++;
                if (indexOpenParen === openParenTarget) {
                    const indexAdd = spliceIndex[index];
                    storedOperators.splice(i + indexAdd, 0, ')');
                    loopStart = (i + indexAdd) + 1;
                    break;
                }
            }
        }
    }   

    indexForRemove = [];
    plusAndMinus(storedNumberSelected, storedOperators); 
    removingElement(indexForRemove, storedNumberSelected, storedOperators);

    indexForRemove = [];
    if (!storedOperators.includes(OPEN_PAREN)) return storedNumberSelected[storedNumberSelected.length - 1];

    let start = 0;
    indexOpenParen = 0;
    
    for (const index in indexOfCloseParen) {
        const targetNum = parseInt(index);
        for (let i = start; i < storedOperators.length; i++) {
            const currOperator = storedOperators[i];
            if (currOperator === OPEN_PAREN) {
                indexOpenParen++;
                if (indexOpenParen === targetNum) {
                    if (operatorThenParen[indexOpenParen] !== indexOfCloseParen[index] && operatorThenParen[indexOpenParen] !== undefined) {
                        storedOperators[i] = operatorThenParen[indexOpenParen];
                        delete operatorThenParen[indexOpenParen];
                    };

                    const plusNMinus = ['+', '−'];
                    let frontOperator = storedOperators[i]; 
                  
                    if (frontOperator === OPEN_PAREN) frontOperator = '×';
                    
                    if (!plusNMinus.includes(frontOperator)) {
                        const currValue = storedNumberSelected[i];
                        const nextValue = storedNumberSelected[i + 1];
                        
                        storedOperators.splice(i , 1);
                        storedNumberSelected[i + 1] = operations(frontOperator, currValue, nextValue);
                        storedNumberSelected.splice(i, 1);
                    }

                    start = i;
                    break;
                }
            }
        }
    }

    let isOpenParenReduce = false;

    for (const index in indexOfCloseParen) {
        const targetNum = isOpenParenReduce ? parseInt(index) - 1 : parseInt(index);
        isOpenParenReduce = true;
        for (const indexNum in operatorThenParen) {
            const operator = operatorThenParen[indexNum];
            const newIndex = parseInt(indexNum) - 1;
            if (targetNum <= parseInt(indexNum)) {
                operatorThenParen[newIndex] = operator;
                delete operatorThenParen[indexNum];
            }
        }
    }

    indexForRemove = [];
    indexOpenParen = 0;
    let indexStart = 0;
    const indexToInvert = {};

    for (const index in operatorThenParen) {
        const parenIndex = parseInt(index);
        const plusNMinus = ['+', '−'];
        for (let i = indexStart; i < storedOperators.length; i++) {
            if (storedOperators[i] === OPEN_PAREN) {
                indexOpenParen++;
                if (parenIndex === indexOpenParen) {
                    const prevOperator = storedOperators[i - 1];
                    if (plusNMinus.includes(prevOperator) && plusNMinus.includes(operatorThenParen[index])) {
                        storedOperators[i] = operatorThenParen[index];
                        indexToInvert[i] = '(';
                        indexStart = i + 1;
                        break;
                    }
                }
            }
        }
    }

    multiplyAndDivide(storedNumberSelected, storedOperators);
    removingElement(indexForRemove, storedNumberSelected, storedOperators);

    indexForRemove = [];

    for (let i = 0; i < storedOperators.length; i++) {
        let currOperator = storedOperators[i];
        const nextOperator = storedOperators[i + 1];
        const prevOperator = storedOperators[i - 1];
        const operatorNotInclude = [MULTIPLICATION, DIVISION, CLOSE_PAREN];
        if (indexToInvert[i]) {
            currOperator = '(';
            storedOperators[i] = '(';
            delete indexToInvert[i];
        }
        if ((currOperator === ADDITION || currOperator === SUBTRACTION) && nextOperator !== OPEN_PAREN && !operatorNotInclude.includes(prevOperator)) {
            const newValue = operations(currOperator, storedNumberSelected[i], storedNumberSelected[i + 1]);
            indexForRemove.push(i);
            storedNumberSelected[i + 1] = newValue;
        }
    }
    removingElement(indexForRemove, storedNumberSelected, storedOperators);
    
    indexForRemove = [];

    start = 0;
    indexOpenParen = 0;

    for (const index in operatorThenParen) {
        for (let i = start; i < storedOperators.length; i++) {
            if (storedOperators[i] === OPEN_PAREN) {
                indexOpenParen++;
                if (parseInt(index) === indexOpenParen) {
                    storedOperators[i] = operatorThenParen[index];
                    start = i;
                    break;
                }
            }
        }
    }

    for (let i = storedOperators.length; i > 0; i--) {
        const currOperator = storedOperators[i - 1];
        let newValue = operations(currOperator, storedNumberSelected[i - 1], storedNumberSelected[i]);

        if (currOperator === OPEN_PAREN) newValue = operations(MULTIPLICATION, storedNumberSelected[i - 1], storedNumberSelected[i]);
        storedNumberSelected[i - 1] = newValue;
    }

    while (storedOperators.length !== 0) {
        storedOperators.pop();
    }

    return storedNumberSelected[0];
};

export { calculateTotal };