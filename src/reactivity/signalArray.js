import { signal } from "./signal.js"

export function signalArray(initial = []) {
  const arrSignal = signal([...initial]);
  arrSignal.push = function (item) {
    arrSignal.value.push(item);
    trigger(arrSignal, "value");
  };
  arrSignal.splice = function (...args) {
    arrSignal.value.splice(...args);
    trigger(arrSignal, "value");
  };
  return arrSignal;
}
