import Big from 'big.js';
import Module from 'ExampleReact/module';

export default function operate(numberOne, numberTwo, operation) {
  const module = new Module();
  const one = Big(numberOne || '0');
  const two = Big(numberTwo || (operation === '÷' || operation === 'x' ? '1' : '0')); // If dividing or multiplying, then 1 maintains current value in cases of null
  if (operation === '+') {
    return one.plus(two).toString();
  }
  if (operation === '-') {
    return one.minus(two).toString();
  }
  if (operation === 'x') {
    return one.times(two).toString();
  }

  if (operation === '÷') {
    if (two.toString() === '0') {
      module.$$emit('notify', 'нельзя делить на 0');
      return '0';
    }
    return one.div(two).toString();
  }
  throw Error(`Unknown operation '${operation}'`);
}
