const ADDITION = '+';
const SUBTRACTION = '−';
const MULTIPLICATION = '×';
const DIVISION = '÷';
const openParenthesis = '(';

const storedValueBeforeParen = [];

const isNextOperatorMultiOrDiv = ({operator}) => {
  return operator === MULTIPLICATION || operator === DIVISION || operator === openParenthesis ? true : false;
};

const totalValueWithParen = (storedValueBeforeParen, lastTotalValueAtLastParen) => {
  let total = 0;
  storedValueBeforeParen.reverse();

  for (let index = 0; index < storedValueBeforeParen.length; index++) {
    for (let indexInOperators = 0; indexInOperators < 1; indexInOperators++) {
      const value = storedValueBeforeParen[index][indexInOperators + 1]
      const operator = storedValueBeforeParen[index][indexInOperators];
      if (index === 0) {
        total = value * lastTotalValueAtLastParen;
      } else {
        switch (operator) {
          case MULTIPLICATION:
            total = total * value;
            break;
          case DIVISION:
            total = total / value;
            break;
          case ADDITION:
            total = total + value;
            break;
          case SUBTRACTION:
            total = value - total;
            break;  
          default:
            break;
        }
      }
    }
  }

  return total;
}

const calculateTotal = (storedNumberSelected, storedOperators) => {
  const storedMulOrDiv = [];
  let isAddition = false;

  const total = storedNumberSelected.reduce((accumulator, value, index) => {
    const operator = storedOperators[index - 1];
    const isNextParenthesis = storedOperators[index] === openParenthesis;
    const isLastIndex = storedNumberSelected.length - index === 1;

    if (index === 0 || storedOperators[index - 1] === openParenthesis) {
      if (isNextParenthesis && index === 0) {
        storedValueBeforeParen.push([MULTIPLICATION, value]);
      } else if (isLastIndex) {
        return accumulator = totalValueWithParen(storedValueBeforeParen, value);
      }
      return accumulator = value;
    }

    if (operator === ADDITION || operator === SUBTRACTION) {

      const newTotalBeforeNextValue = operator === ADDITION ? accumulator + value : accumulator - value;

      if (isNextOperatorMultiOrDiv({operator: storedOperators[index]}) && storedOperators[index] !== openParenthesis) {
        const isOperatorBeforeParenMulOrDiv = storedOperators[storedOperators.indexOf(openParenthesis, index) - 1] === MULTIPLICATION || storedOperators[storedOperators.indexOf(openParenthesis, index) - 1] === DIVISION;
        isAddition = operator === ADDITION;
        storedMulOrDiv.push(value);
        if (((storedOperators[index + 1] === MULTIPLICATION || storedOperators[index + 1] === DIVISION && index < storedOperators.indexOf(openParenthesis, index)) 
          || (storedOperators[index] !== openParenthesis && storedOperators[index - 2] !== openParenthesis)) && isOperatorBeforeParenMulOrDiv) {
          storedValueBeforeParen.push([operator, accumulator]);
        }
        return accumulator;

      } else if (isNextParenthesis) {
        const isIndexParenSecond = storedOperators[1] === openParenthesis;
        if ((storedOperators[index - 2] === DIVISION || storedOperators[index - 2] === MULTIPLICATION || storedOperators[index - 2] === openParenthesis) || isIndexParenSecond) {
          storedValueBeforeParen.push([operator, accumulator]);
        } 
        storedValueBeforeParen.push([MULTIPLICATION, value]);

      } else if (storedOperators[index + 1] === openParenthesis) {
        storedValueBeforeParen.push([storedOperators[index], newTotalBeforeNextValue]);
      }

      return accumulator = isLastIndex && storedOperators.includes(openParenthesis) ? totalValueWithParen(storedValueBeforeParen, newTotalBeforeNextValue) : newTotalBeforeNextValue; 
    };

    const newValue = operator === MULTIPLICATION ? storedMulOrDiv[0] * value : storedMulOrDiv[0] / value;

    if (isNextOperatorMultiOrDiv({operator: storedOperators[index]}) && storedMulOrDiv.length === 1) {
      storedMulOrDiv.splice(0, 1, newValue);
      if (isNextParenthesis) {
        storedMulOrDiv.pop();
        storedValueBeforeParen.push([MULTIPLICATION, newValue]);
        return accumulator = 0;
      }
      return accumulator;

    } else if (!isNextOperatorMultiOrDiv({operator: storedOperators[index]}) && storedMulOrDiv.length === 1) {
      const newTotalBeforeNextValue = isAddition ? accumulator + newValue : accumulator - newValue;
      storedMulOrDiv.pop();
      return accumulator = isLastIndex && storedOperators.includes(openParenthesis) ? totalValueWithParen(storedValueBeforeParen, newTotalBeforeNextValue) : newTotalBeforeNextValue;
    }

    if (isNextParenthesis) {
      const valueForSequence = operator === MULTIPLICATION ?  accumulator * value : accumulator / value;
      storedValueBeforeParen.push([MULTIPLICATION, valueForSequence]);
    }

    if (isLastIndex && storedOperators.includes(openParenthesis)) {
      const lastValue = operator === MULTIPLICATION || operator === DIVISION 
        ? operator === MULTIPLICATION 
          ? accumulator * value : accumulator / value
        : operator === ADDITION  
          ? accumulator + value : accumulator - value;
      const lastTotalValue = totalValueWithParen(storedValueBeforeParen, lastValue);
      return accumulator = lastTotalValue;
    }

    return accumulator = operator === MULTIPLICATION ?  accumulator * value : accumulator / value;
  }, 0);

  return total;
};

export { calculateTotal };