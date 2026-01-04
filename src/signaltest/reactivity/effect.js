export let currentEffect = null

export function effect(fn) {
  currentEffect = fn
  fn()
  currentEffect = null
}
