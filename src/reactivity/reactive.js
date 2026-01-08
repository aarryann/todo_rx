import { activeEffect } from "./effect.js"

//export const deps = new WeakMap()
const proxyCache = new WeakMap()
export const targetMap = new WeakMap();
export const debugKeys = new Set();
const IS_REACTIVE = Symbol("isReactive")

/*
function track1(target, key) {
  if (!activeEffect) return
  let depMap = deps.get(target)
  if (!depMap) deps.set(target, depMap = new Map())
  let dep = depMap.get(key)
  if (!dep) depMap.set(key, dep = new Set())
  dep.add(activeEffect)
}
*/

export function track(target, key) {
  if (!activeEffect) return;

  debugKeys.add(target);
  console.log("track →", target, key);
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect)
}


/*
function trigger1(target, key) {
  console.log("TRIGGER", key)
  deps.get(target)?.get(key)?.forEach(fn => fn())
}
*/

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  console.log("trigger →", target, key);
  const effects = depsMap.get(key);
  if (effects) {
    effects.forEach(effect => effect());
  }
}


export function reactive(obj) {
  if (typeof obj !== "object" || obj === null) return obj

  if (obj[IS_REACTIVE]) return obj

  const existing = proxyCache.get(obj)
  if (existing) return existing

  const proxy = new Proxy(obj, {
    get(target, key, receiver) {
      if (key === IS_REACTIVE) return true
      //console.log(`Getting reactive value for ${key}`);
      track(target, key)
      const res = Reflect.get(target, key, receiver)
      return typeof res === 'object' && res !== null
        ? reactive(res)
        : res;      
    },
    set(target, key, value, receiver) {
      const old = target[key];
      const result = Reflect.set(target, key, value, receiver)
      if (old !== value) {
        trigger(target, key);
      }
      return result
    },
    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key)
      trigger(target, key)
      return result
    }    
  })

  proxy[IS_REACTIVE] = true
  proxyCache.set(obj, proxy)
  return proxy
}

export function printTargetMap() {
  console.log("========== TargetMap ==========")

  debugKeys.forEach(target => {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;

    console.log("Target:", target);

    depsMap.forEach((effects, key) => {
      console.log(`  Property: "${key.toString()}", Effects count: ${effects.size}`)
      effects.forEach((effectFn, idx) => {
        console.log(`    [${idx}] Effect: ${effectFn.name || "anonymous function"}`)
      })
    })
  })
  console.log("================================")
}
