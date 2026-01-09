import { targetMap } from "./reactive.js";

export let activeEffect = null

export function effect1(source, run, {defer = true} = {}) {
  let init = true;
  const runner = (...args) => {
    console.log(`Registering effect ${source} = ${init} = ${defer}`);
    activeEffect = runner;
    const value = source; // auto-track
    activeEffect = null;
    if (!(defer && init)) {
      run(...args, value);
    }
    init = false;
  };

  runner();
}

export function effect2(run) {
  console.log(`Registering effect 2`);
  activeEffect = run;
  run();
  activeEffect = null;

}

export function cleanup(effectFn) {
  if (!effectFn.deps) return;
  for (const dep of effectFn.deps) {
    dep.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

/**
 * 
 * Mode 1: Auto inference - effect(fn, opts) = effect(() => { lbl.textContent = state.user }, {})
 * Mode 2: Optimized with getters - effect(fn, opts) = effect(([tag, status])=>{lbl.textContent = `The status of ${tag} is ${status}`}, {defer: true, deps:[() => card.tag, () => card.status]})
 * Mode 3: Optimized with value tuples - effect(fn, opts) = effect(([tag, status])=>{lbl.textContent = `The status of ${tag} is ${status}`}, {defer: true, deps:[[card, "tag"], [card, "status"]]})
 * 
 */
export function effect(fn, opts = {}) {
  const {
    deps = null,
    lazy = false,
    scheduler = null
  } = opts;
  let init = true;

  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;

    let values = [];

    // MODE 1: auto inference
    if (!deps) {
      if (!(lazy && init)) fn();
    }

    // MODE 2: getter deps
    else if (typeof deps[0] === "function") {
      values = deps.map(getter => getter());
      activeEffect = null;
      if (!(lazy && init)) fn(values);
    }

    // MODE 3: tuple deps
    else if (Array.isArray(deps[0])) {
      values = deps.map(([target, key]) => {
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

        if (!dep.has(effectFn)) {
          dep.add(effectFn);
          effectFn.deps.push(dep);
        }

        return target[key];
      })
      activeEffect = null
      if (!(lazy && init)) fn(values);
    }
    activeEffect = null
    init = false;
  }
  effectFn.deps = []
  effectFn.scheduler = scheduler

  if (!lazy) {
    effectFn()
  }

  return effectFn  
}
