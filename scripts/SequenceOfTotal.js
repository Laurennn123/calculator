const arithmeticOperators = ['+', '−', '×', '÷', '(']; 
const [ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION, openParenthesis] = arithmeticOperators;

const isNextOperatorMulDivOrParen = ({operator}) => {
  return operator === MULTIPLICATION || operator === DIVISION || operator === openParenthesis ? true : false;
};

const operations = (operator, total, value) => {
  let equalValue = 0;

  switch (operator) {
    case MULTIPLICATION:
      equalValue = total * value;
      break;
    case DIVISION:
      equalValue = value / total;
      break;
    case ADDITION:
      equalValue = total + value;
      break;
    case SUBTRACTION:
      equalValue = value - total;
      break;  
    default:
      break;
  }

  return equalValue;
};

const totalValue = (storedValueForTotal, lastTotalValueAtLastParen) => {
  let total = 0;
  storedValueForTotal.reverse();

  for (let index = 0; index < storedValueForTotal.length; index++) {
    for (let indexInOperators = 0; indexInOperators < 1; indexInOperators++) {
      const value = storedValueForTotal[index][indexInOperators + 1]
      const operator = storedValueForTotal[index][indexInOperators];
      const equalValue = index === 0 ? operations(operator, lastTotalValueAtLastParen, value) : operations(operator, total, value);
      total = equalValue;
    }
  }

  return total;
}

const indexOfHaveOpBeforeParen = [];
const storedValueForTotal = [];

const isOperatorBeforeParen = () => {
  const isOperator = $("#text-area").text().substring(0, indexOfHaveOpBeforeParen[0]).slice(-1);
  indexOfHaveOpBeforeParen.shift();
  if (arithmeticOperators.includes(isOperator)) {
    return true;
  }
  return false;
};



const calculateTotal = (storedNumberSelected, storedOperators) => {
  const split = [...$("#text-area").text()]; 
  const indexOfParen = split.reduce((accumulator, element, index) => {
    if (element === openParenthesis && split[index - 1] !== openParenthesis && split[index - 1] !== undefined) accumulator.push(index);
    return accumulator;
  }, []);
  indexOfHaveOpBeforeParen.push(...indexOfParen);
  const storedMulOrDiv = [];
  let isAddition = false;

  const total = storedNumberSelected.reduce((accumulator, value, index) => {
    const operator = storedOperators[index - 1];
    const isNextParenthesis = storedOperators[index] === openParenthesis;
    const isLastIndex = storedNumberSelected.length - index === 1;

    if (index === 0 || operator === openParenthesis) {
      if (isNextParenthesis) {
        indexOfHaveOpBeforeParen.shift();
        storedValueForTotal.push([MULTIPLICATION, value]);
      }
      if (isLastIndex) {
        return accumulator = totalValue(storedValueForTotal, value);
      };
      return accumulator = value;
    };

    if (operator === ADDITION || operator === SUBTRACTION) {
      isAddition = operator === ADDITION;

      let newTotalBeforeNextValue = operator === ADDITION ? accumulator + value : accumulator - value;

      if (isNextOperatorMulDivOrParen({operator: storedOperators[index]}) && storedOperators[index] !== openParenthesis) {
        const isOperatorBeforeParen_MulOrDiv = storedOperators[storedOperators.indexOf(openParenthesis, index) - 1] === MULTIPLICATION || storedOperators[storedOperators.indexOf(openParenthesis, index) - 1] === DIVISION;
        const isAfterNextOperator_MulDivOrParen = storedOperators[index + 1] === MULTIPLICATION || storedOperators[index + 1] === DIVISION || storedOperators[index + 1] === openParenthesis;
        storedMulOrDiv.push(value);
        if (isAfterNextOperator_MulDivOrParen && isOperatorBeforeParen_MulOrDiv) {
          storedValueForTotal.push([operator, accumulator]);
        };
        return accumulator;
      };
      
      if (isNextParenthesis) {
        storedValueForTotal.push([operator, accumulator]);
        if (isOperatorBeforeParen()) { /* e.g. 6(5-(5)) */
          if (!isLastIndex) {
            storedOperators.splice(index, 1);
            return accumulator = value;
          };
          newTotalBeforeNextValue = value;
        } else {
          storedValueForTotal.push([MULTIPLICATION, value]);
        };
      };
      
      if (storedOperators[index + 1] === openParenthesis && !arithmeticOperators.includes(storedOperators[index])) {
        storedValueForTotal.push([storedOperators[index], newTotalBeforeNextValue]);
      };

      return accumulator = isLastIndex && storedOperators.includes(openParenthesis) ? totalValue(storedValueForTotal, newTotalBeforeNextValue) : newTotalBeforeNextValue; 
    };

    if (isNextParenthesis) {
      if (isOperatorBeforeParen()) {
        const storeValue = storedMulOrDiv.length === 1 ? storedMulOrDiv[0] : accumulator;
        storedValueForTotal.push([operator, storeValue]); 
        if (storedMulOrDiv.length === 1) storedMulOrDiv.pop();
        if (storedOperators[index + 1] === openParenthesis) {
          indexOfHaveOpBeforeParen.shift();
          storedValueForTotal.push([MULTIPLICATION, value]);
        }
        storedOperators.splice(index, 1);
        return accumulator = isLastIndex ? totalValue(storedValueForTotal, value) : value;
      };
    }
    
    const newValue = operator === MULTIPLICATION ? storedMulOrDiv[0] * value : storedMulOrDiv[0] / value;

    if (isNextOperatorMulDivOrParen({operator: storedOperators[index]}) && storedMulOrDiv.length === 1) {
      storedMulOrDiv.splice(0, 1, newValue);
      if (isNextParenthesis) {
        storedMulOrDiv.pop();
        storedValueForTotal.push([MULTIPLICATION, newValue]);
        return accumulator = 0;
      };
      return accumulator;
    };
    
    if (storedMulOrDiv.length === 1) { /* for next operator either addition or subtraction and stored the value from the previous index */
      const newTotalBeforeNextValue = isAddition ? accumulator + newValue : accumulator - newValue;
      storedMulOrDiv.pop();
      return accumulator = isLastIndex && storedOperators.includes(openParenthesis) ? totalValue(storedValueForTotal, newTotalBeforeNextValue) : newTotalBeforeNextValue;
    };

    if (isNextParenthesis) {
      const valueForSequence = operator === MULTIPLICATION ?  accumulator * value : accumulator / value;
      storedValueForTotal.push([MULTIPLICATION, valueForSequence]);
    };

    if (isLastIndex && storedOperators.includes(openParenthesis)) {
      const lastValue = operations(operator, value, accumulator);
      const lastTotalValue = totalValue(storedValueForTotal, lastValue);
      return accumulator = lastTotalValue;
    };

    return accumulator = operator === MULTIPLICATION ?  accumulator * value : accumulator / value;
  }, 0);

  return total;
};

export { calculateTotal, storedValueForTotal };