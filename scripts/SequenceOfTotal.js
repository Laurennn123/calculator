import { storedOperators } from "./NumberAndOperatorButtons.js";

const arithmeticOperators = ['+', '−', '×', '÷', '(']; 
const [ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION, openParenthesis] = arithmeticOperators;

const isNextOperatorMultiOrDiv = ({operator}) => {
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

const storedValueBeforeParen = [];

const totalValueWithParen = (storedValueBeforeParen, lastTotalValueAtLastParen) => {
  let total = 0;
  storedValueBeforeParen.reverse();

  for (let index = 0; index < storedValueBeforeParen.length; index++) {
    for (let indexInOperators = 0; indexInOperators < 1; indexInOperators++) {
      const value = storedValueBeforeParen[index][indexInOperators + 1]
      const operator = storedValueBeforeParen[index][indexInOperators];
      const equalValue = index === 0 ? operations(operator, lastTotalValueAtLastParen, value) : operations(operator, total, value);
      total = equalValue;
    }
  }

  return total;
}

let indexOfHaveOpBeforeParen = [];

const isOperatorBeforeParen = (indexNumber) => {
  const operator = storedOperators[indexNumber - 1];
  const isOperatorOrNot = $("#text-area").text().substring(0, indexOfHaveOpBeforeParen[0]).slice(-1);
  const indexOfParen = storedOperators.indexOf(openParenthesis, indexNumber);
  if (operator === isOperatorOrNot && (indexOfParen === indexNumber || storedOperators[0] === openParenthesis)) {
    indexOfHaveOpBeforeParen.shift();
    return true;
  }
  return false;
};

const calculateTotal = (storedNumberSelected, storedOperators) => {
  const storedMulOrDiv = [];
  const split = [...$("#text-area").text()]; 
  const indexOfParen = split.reduce((accumulator, element, index) => {
    if (element === '(' && arithmeticOperators.includes(split[index - 1])) accumulator.push(index);
    return accumulator;
  }, []);
  indexOfHaveOpBeforeParen = [...indexOfParen];
  let isAddition = false;

  const total = storedNumberSelected.reduce((accumulator, value, index) => {
    const operator = storedOperators[index - 1];
    const isNextParenthesis = storedOperators[index] === openParenthesis;
    const isLastIndex = storedNumberSelected.length - index === 1;

    if (index === 0 || storedOperators[index - 1] === openParenthesis) {
      if (isNextParenthesis) {
        storedValueBeforeParen.push([MULTIPLICATION, value]);
      }
      if (isLastIndex) {
        return accumulator = totalValueWithParen(storedValueBeforeParen, value);
      };
      return accumulator = value;
    };

    if (operator === ADDITION || operator === SUBTRACTION) {
      isAddition = operator === ADDITION;

      let newTotalBeforeNextValue = operator === ADDITION ? accumulator + value : accumulator - value;

      if (isNextOperatorMultiOrDiv({operator: storedOperators[index]}) && storedOperators[index] !== openParenthesis) {
        const isOperatorBeforeParenMulOrDiv = storedOperators[storedOperators.indexOf(openParenthesis, index) - 1] === MULTIPLICATION || storedOperators[storedOperators.indexOf(openParenthesis, index) - 1] === DIVISION;
        storedMulOrDiv.push(value);
        if ((storedOperators[index + 1] === MULTIPLICATION || storedOperators[index + 1] === DIVISION || storedOperators[index + 1] === openParenthesis) && isOperatorBeforeParenMulOrDiv) {
          storedValueBeforeParen.push([operator, accumulator]);
        };
        return accumulator;
      };
      
      if (isNextParenthesis) {
        if ((storedOperators[index - 2] === DIVISION || storedOperators[index - 2] === MULTIPLICATION || storedOperators[index - 2] === openParenthesis) || isNextParenthesis) {
          storedValueBeforeParen.push([operator, accumulator]);
        }; 
        if (isOperatorBeforeParen(index)) { /* e.g. 6(5-(5x2)) */
          if (!isLastIndex) {
            storedOperators.splice(index, 1);
            return accumulator = value;
          };
          newTotalBeforeNextValue = value;
        } else {
          storedValueBeforeParen.push([MULTIPLICATION, value]);
        };
      };
      
      if (storedOperators[index + 1] === openParenthesis && !arithmeticOperators.includes(storedOperators[index])) {
        storedValueBeforeParen.push([storedOperators[index], newTotalBeforeNextValue]);
      };

      return accumulator = isLastIndex && storedOperators.includes(openParenthesis) ? totalValueWithParen(storedValueBeforeParen, newTotalBeforeNextValue) : newTotalBeforeNextValue; 
    };

    if (isOperatorBeforeParen(index)) {
      if (isNextOperatorMultiOrDiv({operator: storedOperators[index]}) && storedMulOrDiv.length === 1) {
        storedValueBeforeParen.push([operator, storedMulOrDiv[0]]);
        storedMulOrDiv.pop();
        storedOperators.splice(index, 1);
      } else {
        storedValueBeforeParen.push([operator, accumulator]);
        storedOperators.splice(index, 1);
      };
      return accumulator = value;
    };
    
    const newValue = operator === MULTIPLICATION ? storedMulOrDiv[0] * value : storedMulOrDiv[0] / value;

    if (isNextOperatorMultiOrDiv({operator: storedOperators[index]}) && storedMulOrDiv.length === 1) {
      storedMulOrDiv.splice(0, 1, newValue);
      if (isNextParenthesis) {
        storedMulOrDiv.pop();
        storedValueBeforeParen.push([MULTIPLICATION, newValue]);
        return accumulator = 0;
      };
      return accumulator;
    };
    
    if (storedMulOrDiv.length === 1) {
      const newTotalBeforeNextValue = isAddition ? accumulator + newValue : accumulator - newValue;
      storedMulOrDiv.pop();
      return accumulator = isLastIndex && storedOperators.includes(openParenthesis) ? totalValueWithParen(storedValueBeforeParen, newTotalBeforeNextValue) : newTotalBeforeNextValue;
    };

    if (isNextParenthesis) {
      const valueForSequence = operator === MULTIPLICATION ?  accumulator * value : accumulator / value;
      storedValueBeforeParen.push([MULTIPLICATION, valueForSequence]);
    };

    if (isLastIndex && storedOperators.includes(openParenthesis)) {
      const lastValue = operations(operator, value, accumulator);
      const lastTotalValue = totalValueWithParen(storedValueBeforeParen, lastValue);
      return accumulator = lastTotalValue;
    };

    return accumulator = operator === MULTIPLICATION ?  accumulator * value : accumulator / value;
  }, 0);

  return total;
};

export { calculateTotal };
export { storedValueBeforeParen };