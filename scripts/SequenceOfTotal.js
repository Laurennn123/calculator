import { storedNumberSelected, storedOperators, parenthesisIndex } from "./NumberAndOperatorButtons.js";

const ADDITION = '+';
const SUBTRACTION = '−';
const MULTIPLICATION = '×';
const DIVISION = '÷';

const storedValueBeforeParen = [];

const isNextOperatorMultiOrDiv = ({operator}) => {
  return operator === MULTIPLICATION || operator === DIVISION ? true : false;
};

const totalValueWithParen = (storedValueBeforeParen, newTotalBeforeNextValue) => {
  let total = 0;
  storedValueBeforeParen.reverse();

  for (let index = 0; index < storedValueBeforeParen.length; index++) {
    for (let indexInOperators = 0; indexInOperators < 1; indexInOperators++) {
      const value = indexInOperators + 1;
      if (index === 0) {
        total = storedValueBeforeParen[index][value] * newTotalBeforeNextValue;
      } else if (storedValueBeforeParen[index][indexInOperators] === MULTIPLICATION) {
        total = total * storedValueBeforeParen[index][value];
      } else if (storedValueBeforeParen[index][indexInOperators] === ADDITION) {
        total = total + storedValueBeforeParen[index][value];
      } else if (storedValueBeforeParen[index][indexInOperators] === SUBTRACTION) {
        total = storedValueBeforeParen[index][value] - total;
      } else {
        total = total / storedValueBeforeParen[index][value];
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

    if (index === 0) {
      if (parenthesisIndex[index] === MULTIPLICATION) {
        storedValueBeforeParen.push(['×', value]);
      }
      return accumulator = value;
    }

    if (parenthesisIndex[index - 1] === MULTIPLICATION) {
      return accumulator = value;
    }

    if (operator === ADDITION || operator === SUBTRACTION) {

      const newTotalBeforeNextValue = operator === ADDITION ? accumulator + value : accumulator - value;

      if (isNextOperatorMultiOrDiv({operator: storedOperators[index]}) && parenthesisIndex[index] !== MULTIPLICATION) {
        isAddition = operator === ADDITION;
        storedMulOrDiv.push(value);

        if (((storedOperators[index + 1] === MULTIPLICATION || storedOperators[index + 1] === DIVISION && index < parenthesisIndex.indexOf(MULTIPLICATION, index)) 
          || (parenthesisIndex[index] !== MULTIPLICATION && parenthesisIndex[index - 2] !== MULTIPLICATION)) && (storedOperators[parenthesisIndex.indexOf(MULTIPLICATION, index) - 1] === MULTIPLICATION || storedOperators[parenthesisIndex.indexOf(MULTIPLICATION, index) - 1] === DIVISION)) {
          storedValueBeforeParen.push([operator, accumulator]);
        }

        return accumulator;
      } else if (parenthesisIndex[index] === MULTIPLICATION) {

        if ((storedOperators[index - 2] === DIVISION || storedOperators[index - 2] === MULTIPLICATION)) {
          storedValueBeforeParen.push([operator, accumulator]);
        } else if (parenthesisIndex[1] === MULTIPLICATION) {
          storedValueBeforeParen.push([operator, accumulator]);
        }

        storedValueBeforeParen.push([storedOperators[index], value]);

      } else if (parenthesisIndex[index + 1] === MULTIPLICATION) {
        storedValueBeforeParen.push([storedOperators[index], newTotalBeforeNextValue]);
      }

      return accumulator = storedNumberSelected.length - index === 1 && parenthesisIndex.length !== 0? totalValueWithParen(storedValueBeforeParen, newTotalBeforeNextValue) : newTotalBeforeNextValue; 
    };

    const newValue = operator === MULTIPLICATION ? storedMulOrDiv[0] * value : storedMulOrDiv[0] / value;

    if (isNextOperatorMultiOrDiv({operator: storedOperators[index]}) && storedMulOrDiv.length === 1) {
      storedMulOrDiv.splice(0, 1, newValue);

      if (parenthesisIndex[index] === MULTIPLICATION) {
        storedMulOrDiv.pop();
        storedValueBeforeParen.push([storedOperators[index], newValue]);
        return accumulator = 0;
      }
      
      return accumulator;
    }

    if (!isNextOperatorMultiOrDiv({operator: storedOperators[index]}) && storedMulOrDiv.length === 1) {
      const newTotalBeforeNextValue = isAddition ? accumulator + newValue : accumulator - newValue;
      storedMulOrDiv.pop();
      return accumulator = storedNumberSelected.length - index === 1 && parenthesisIndex.length !== 0 ? totalValueWithParen(storedValueBeforeParen, newTotalBeforeNextValue) : newTotalBeforeNextValue;
    }

    if (parenthesisIndex[index] === MULTIPLICATION) {
      const valueForSequence = operator === MULTIPLICATION ?  accumulator * value : accumulator / value;
      storedValueBeforeParen.push([storedOperators[index], valueForSequence]);
    }

    if (storedNumberSelected.length - index === 1 && parenthesisIndex.length !== 0) {
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

const totalValue = calculateTotal(storedNumberSelected, storedOperators);

export { totalValue };