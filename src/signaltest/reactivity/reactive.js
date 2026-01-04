import { currentEffect } from "./effect.js"

const deps = new WeakMap()

function track(target, key) {
  if (!currentEffect) return
  let depMap = deps.get(target)
  if (!depMap) deps.set(target, depMap = new Map())
  let dep = depMap.get(key)
  if (!dep) depMap.set(key, dep = new Set())
  dep.add(currentEffect)
}

function trigger(target, key) {
  deps.get(target)?.get(key)?.forEach(fn => fn())
}

export function reactive(obj) {
  if (typeof obj !== "object" || obj === null) return obj

  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key)
      const value = Reflect.get(target, key, receiver)
      return reactive(value)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return result
    }
  })
}
