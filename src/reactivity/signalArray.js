import { signal } from "./signal.js"
import { reactive } from "./reactive.js"

export function signalArray(initial = []) {
  const raw = reactive(initial)
  const length = signal(raw.length)

  const proxy = new Proxy(raw, {
    get(target, key, receiver) {
      if (key === "push") {
        return (...items) => {
          const result = Array.prototype.push.apply(
            target,
            items.map(reactive)
          )
          length.value = target.length
          return result
        }
      }

      if (key === "splice") {
        return (...args) => {
          const result = Array.prototype.splice.apply(target, args)
          length.value = target.length
          return result
        }
      }

      return Reflect.get(target, key, receiver)
    }
  })

  return {
    value: proxy,
    length
  }
}
