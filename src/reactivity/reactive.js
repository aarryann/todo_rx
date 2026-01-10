let currentEffect = null;
export const effectTracker = new WeakMap();
export const debugKeys = new Set();
const proxyCache = new WeakMap()
const IS_REACTIVE = Symbol("isReactive")

export const activeEffect = {
  get value () {
    return currentEffect;
  },
  set value (effect) {
    currentEffect = effect;
  }
}

export function track(stateObj, key) {
  if (!activeEffect.value) return;

  debugKeys.add(stateObj);
  let keyEffectsMap = effectTracker.get(stateObj);
  if (!keyEffectsMap) {
    keyEffectsMap = new Map();
    effectTracker.set(stateObj, keyEffectsMap);
  }

  let keyEffects = keyEffectsMap.get(key);
  if (!keyEffects) {
    keyEffects = new Set();
    keyEffectsMap.set(key, keyEffects);
  }
  if (!keyEffects.has(activeEffect.value)) {
    keyEffects.add(activeEffect.value)
  }
}

export function trigger(stateObj, key) {
  const keyEffectsMap = effectTracker.get(stateObj);
  if (!keyEffectsMap) return;

  const effects = keyEffectsMap.get(key);
  if (effects) {
    effects.forEach(effect => {
      if (effect.scheduler) {
        effect.scheduler(effect);
      } else {
        effect();
      }
    })
  }
}

export function reactive(obj) {
  if (typeof obj !== "object" || obj === null) return obj;

  if (obj[IS_REACTIVE]) return obj;

  const cached = proxyCache.get(obj);
  if (cached) return cached;

  const proxy = new Proxy(obj, {
    get(target, key, receiver) {
      if (key === IS_REACTIVE) return true;
      //console.log(`Getting reactive value for ${key}`);
      track(target, key);
      const res = Reflect.get(target, key, receiver);
      return typeof res === 'object' && res !== null
        ? reactive(res)
        : res;      
    },
    set(target, key, value, receiver) {
      const old = target[key];
      const result = Reflect.set(target, key, value, receiver);
      if (old !== value) trigger(target, key);
      return result
    },
    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key);
      trigger(target, key);
      return result
    }    
  })

  proxy[IS_REACTIVE] = true
  proxyCache.set(obj, proxy)
  return proxy
}

export function printTrackedEffects() {
  console.log("========== TrackedEffects ==========")

  debugKeys.forEach(stateObj => {
    const keyEffectsMap = effectTracker.get(stateObj);
    if (!keyEffectsMap) return;

    console.log("Target:", stateObj);
    keyEffectsMap.forEach((effects, key) => {
      console.log(`  Property: "${key.toString()}", Effects count: ${effects.size}`)
      effects.forEach((effectFn, idx) => {
        console.log(`    [${idx}] Effect: ${effectFn.name || "anonymous function"}`)
      })
    })
  })
  console.log("================================")
}
