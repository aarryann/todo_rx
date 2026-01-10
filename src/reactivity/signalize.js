import { signal } from "./signal.js"
import { printTrackedEffects, reactive,  } from "./reactive.js"
import { signalArray } from "./signalArray.js"
import { stateToNotify } from "./notifyWindow.js";
import { effect } from "./effect.js"

export { effect, printTrackedEffects, stateToNotify };

export function signalize(value) {
  // primitives → signal
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return signal(value)
  }

  // arrays → signalArray
  if (Array.isArray(value)) {
    const arr = signalArray([])
    value.forEach(item => {
      arr.value.push(unwrapSignal(item))
    })
    return arr
  }

  // objects → reactive object
  const obj = {}
  for (const key in value) {
    obj[key] = unwrapSignal(value[key])
  }
  return reactive(obj)
}

function unwrapSignal(value) {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return value
  }

  if (Array.isArray(value)) {
    const arr = signalArray([])
    value.forEach(v => arr.value.push(unwrapSignal(v)))
    return arr
  }

  const obj = {}
  for (const k in value) {
    obj[k] = unwrapSignal(value[k])
  }
  return reactive(obj)
}
