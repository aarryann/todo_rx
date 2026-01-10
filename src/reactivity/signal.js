import { track, trigger } from "./reactive.js";

export function signal(initialValue) {
  let _value = initialValue;

  const s = {
    get value() {
      track(s, "value");  // track this signal for effects
      return _value;
    },
    set value(newValue) {
      if (_value !== newValue) {
        _value = newValue;
        trigger(s, "value");  // only triggers effects subscribed to this signal
      }
    }
  };

  return s;
}
