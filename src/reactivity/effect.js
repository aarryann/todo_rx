import { notifyAll, stateToNotify } from "./notifyWindow.js";
import { activeEffect, effectTracker } from "./reactive.js";

export function cleanup(effectFn) {
  if (!effectFn.trackers) return;
  for (const tracker of effectFn.trackers) {
    tracker.delete(effectFn);
  }
  effectFn.trackers.length = 0;
}

/**
 * 
 * Mode 1: Auto inference - effect(fn, opts) = effect(() => { lbl.textContent = state.user }, {})
 * Mode 2: Optimized with getters - effect(fn, opts) = effect(([tag, status])=>{lbl.textContent = `The status of ${tag} is ${status}`}, {defer: true, watches:[() => card.tag, () => card.status]})
 * Mode 3: Optimized with value tuples - effect(fn, opts) = effect(([tag, status])=>{lbl.textContent = `The status of ${tag} is ${status}`}, {defer: true, watches:[[card, "tag"], [card, "status"]]})
 * 
 */
export function effect(fnWatched, opts = {}) {
  const { watches = null, lazy = true, scheduler = null } = opts;
  let init = true;

  const fn = (values = null) => {
    fnWatched(values);
    notifyAll(stateToNotify.value);
  }

  const wrapped = () => {
    cleanup(wrapped);
    activeEffect.value = wrapped;

    let values = [];

    // MODE 1: auto inference
    if (!watches) {
      if (!(lazy && init)) fn();
    }

    // MODE 2: getter watches
    else if (typeof watches[0] === "function") {
      values = watches.map(getter => getter());
      activeEffect.value = null;
      if (!(lazy && init)) fn(values);
    }

    // MODE 3: tuple watches
    else if (Array.isArray(watches[0])) {
      values = watches.map(([stateObj, key]) => {
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

        if (!keyEffects.has(wrapped)) {
          keyEffects.add(wrapped);
          wrapped.trackers.push(keyEffects);
        }

        return stateObj[key];
      })
      activeEffect.value = null
      if (!(lazy && init)) fn(values);
    }
    activeEffect.value = null
    init = false;
  }
  wrapped.trackers = []
  wrapped.scheduler = scheduler
  wrapped()

  return wrapped  
}
