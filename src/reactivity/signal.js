import { currentEffect } from "./effect.js"

export function signal(initial) {
  let value = initial
  const subs = new Set()

  return {
    get value() {
      if (currentEffect) subs.add(currentEffect)
      return value
    },
    set value(v) {
      if (v !== value) {
        value = v
        subs.forEach(fn => fn())
      }
    }
  }
}
