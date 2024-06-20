import { storedNumberSelected, storedOperators, parenthesisIndex } from "./NumberAndOperatorButtons.js";

const ADDITION = '+';
const SUBTRACTION = '−';
const MULTIPLICATION = '×';
const DIVISION = '÷';

const storedMulOrDiv = [];
const storedValueBeforeParen = [];
let isAddition = false;

const isNextOperatorMultiOrDiv = ({operator}) => {
  return operator === MULTIPLICATION || operator === DIVISION ? true : false;
};

const calculateTotal = (storedNumberSelected, storedOperators) => {
  const total = storedNumberSelected.reduce((accumulator, value, index) => {
    const operator = storedOperators[index - 1];

    if (index === 0) {
      storedValueBeforeParen.push(value);
      return accumulator = value;
    }

    if (parenthesisIndex[index - 1] === MULTIPLICATION) {
      return accumulator = value;
    }

    if (operator === ADDITION || operator === SUBTRACTION) {
      if (isNextOperatorMultiOrDiv({operator: storedOperators[index]})) {
        isAddition = operator === ADDITION;
        storedMulOrDiv.push(value);
        return accumulator;
      }
      return accumulator = operator === ADDITION ? accumulator += value : accumulator -= value; 
    };

    const newValue = operator === MULTIPLICATION ? storedMulOrDiv[0] * value : storedMulOrDiv[0] / value;

    if (isNextOperatorMultiOrDiv({operator: storedOperators[index]}) && storedMulOrDiv.length === 1) {
      storedMulOrDiv.splice(0, 1, newValue);
      return accumulator;
    }

    if (!isNextOperatorMultiOrDiv({operator: storedOperators[index]}) && storedMulOrDiv.length === 1) {
      const newTotalBeforeNextValue = newValue;
      storedMulOrDiv.pop();
      return accumulator = isAddition ? accumulator += newTotalBeforeNextValue : accumulator -= newTotalBeforeNextValue;
    }

    return accumulator = operator === MULTIPLICATION ?  accumulator *= value : accumulator /= value;
  }, 0);

  return total;
};

const totalValue = calculateTotal(storedNumberSelected, storedOperators);

export { totalValue };



